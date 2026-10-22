// RESPONSIBILITY: Formats WhatsApp messages as a monospaced "receipt" or "ticket" for a premium look in WhatsApp.

export interface WhatsappReceiptSection {
  title?: string;
  items: Record<string, string>;
}

export interface WhatsappReceiptOptions {
  title: string;
  subtitle?: string;
  date?: string;
  customerInfo?: Record<string, string>;
  sections: WhatsappReceiptSection[];
  footer?: string;
}

/**
 * Utility class to generate premium receipt-style monospaced WhatsApp messages.
 * Uses triple backticks to enforce monospace rendering in WhatsApp.
 */
export class WhatsAppFormatter {
  private static readonly WIDTH = 28;

  /**
   * Centers text within the fixed width for receipt alignment.
   */
  public static centerText(text: string): string {
    if (text.length >= this.WIDTH) return text;
    const pad = Math.floor((this.WIDTH - text.length) / 2);
    return ' '.repeat(pad) + text + ' '.repeat(this.WIDTH - text.length - pad);
  }

  /**
   * Generates a fully formatted WhatsApp receipt string wrapped in triple backticks.
   */
  public static formatReceipt(options: WhatsappReceiptOptions): string {
    const lines: string[] = ['```'];
    
    // Header
    lines.push(this.centerText(options.title));
    if (options.subtitle) {
      lines.push(this.centerText(options.subtitle));
    }
    lines.push('-'.repeat(this.WIDTH));
    
    // Date & Customer Info
    if (options.date) {
      lines.push(`Date: ${options.date}`);
    }
    if (options.customerInfo) {
      Object.entries(options.customerInfo).forEach(([key, value]) => {
        lines.push(`${key}: ${value}`);
      });
    }
    
    if (options.date || options.customerInfo) {
      lines.push('-'.repeat(this.WIDTH));
    }

    // Sections
    options.sections.forEach(section => {
      if (section.title) {
        lines.push(this.centerText(section.title));
        lines.push('-'.repeat(this.WIDTH));
      }
      
      // Calculate max key length to perfectly align all values in this section
      const keys = Object.keys(section.items);
      const maxKeyLen = keys.length > 0 ? Math.max(...keys.map(k => k.length)) : 0;

      Object.entries(section.items).forEach(([key, value]) => {
        const paddedKey = key.padEnd(maxKeyLen, ' ');
        lines.push(`${paddedKey}: ${value}`);
      });
      
      lines.push('-'.repeat(this.WIDTH));
    });

    // Footer
    if (options.footer) {
      lines.push(this.centerText(options.footer));
    }
    
    lines.push('```');
    return lines.join('\n');
  }
}
