import { ApiResponse } from './api';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
class MockDB {
  private static prefix = 'gymsmart_mock_';
  
  static getCollection(name: string, defaultData: Record<string, unknown>[] = []): Record<string, unknown>[] {
    if (typeof window === 'undefined') return defaultData;
    const val = localStorage.getItem(this.prefix + name);
    if (val) return JSON.parse(val);
    this.setCollection(name, defaultData);
    return defaultData;
  }
  
  static setCollection(name: string, data: Record<string, unknown>[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.prefix + name, JSON.stringify(data));
    }
  }

  static handleCrud(collectionName: string, method: string, path: string, body?: unknown, defaultData: Record<string, unknown>[] = [], listKey?: string) {
    const coll = this.getCollection(collectionName, defaultData);
    const segments = path.split('?')[0].split('/');
    const possibleId = segments[segments.length - 1];
    
    // Determine if we are querying an ID (PATCH/DELETE or GET with an ID segment)
    const isBaseEndpoint = path.split('?')[0].endsWith(collectionName) || path.split('?')[0].endsWith(collectionName.split('_').pop() || '');
    const id = (method === 'PATCH' || method === 'DELETE' || (method === 'GET' && !isBaseEndpoint)) ? possibleId : null;

    if (method === 'GET') {
      if (id) {
        const item = coll.find(x => String(x.id) === String(id));
        return { success: !!item, message: item ? 'Fetched' : 'Not found', data: item || null };
      }
      // Return wrapped object if listKey provided, otherwise array
      return { success: true, message: 'Fetched list', data: listKey ? { [listKey]: coll, total: coll.length } : coll };
    }
    
    if (method === 'POST') {
      let idStr = `${collectionName.split('_').pop()}-${Date.now()}`;
      
      // Custom ID format for members
      if (collectionName === 'mock_members') {
        const today = new Date();
        const dateStr = String(today.getDate()).padStart(2, '0') + String(today.getMonth() + 1).padStart(2, '0') + today.getFullYear();
        const nextNo = String(coll.length + 1).padStart(3, '0');
        idStr = `GS-${dateStr}-${nextNo}`;
      }

      const newItem = {
        id: idStr,
        ...(body as Record<string, unknown>),
        createdAt: new Date().toISOString()
      };
      coll.push(newItem);
      this.setCollection(collectionName, coll);
      return { success: true, message: 'Created successfully', data: newItem };
    }
    
    if (method === 'PATCH' || method === 'PUT') {
      const idx = coll.findIndex(x => String(x.id) === String(id));
      if (idx === -1) return { success: false, message: 'Not found', data: null };
      coll[idx] = { ...coll[idx], ...(body as Record<string, unknown>), updatedAt: new Date().toISOString() };
      this.setCollection(collectionName, coll);
      return { success: true, message: 'Updated successfully', data: coll[idx] };
    }
    
    if (method === 'DELETE') {
      const newColl = coll.filter(x => String(x.id) !== String(id));
      this.setCollection(collectionName, newColl);
      return { success: true, message: 'Deleted successfully', data: { id } };
    }

    return { success: false, message: 'Method not allowed', data: null };
  }

  static generatePayrollsForMonth(reqMonth: string) {
    const staffList = this.getCollection('mock_admin_staff', []);
    const attendanceList = this.getCollection('mock_admin_attendance', []);
    let currentPayrolls = this.getCollection('mock_admin_payrolls', []);

    // Purge orphaned payrolls (staff deleted before cascade fix)
    const validStaffIds = new Set(staffList.map(s => String(s.id)));
    currentPayrolls = currentPayrolls.filter((p: any) => validStaffIds.has(String(p.staffId)));

    const today = new Date();
    const reqDate = reqMonth.includes('-') ? new Date(`${reqMonth}-01`) : new Date(reqMonth);
    const daysInMonth = !isNaN(reqDate.getTime()) ? new Date(reqDate.getFullYear(), reqDate.getMonth() + 1, 0).getDate() : 30;

    const isCurrentMonth = reqMonth === today.toLocaleString('en-US', { month: 'long', year: 'numeric' }) || reqMonth === today.toISOString().slice(0, 7);
    const daysElapsed = isCurrentMonth ? today.getDate() : daysInMonth;

    staffList.filter((s: any) => s.isActive).forEach((s: any) => {
      const staffAtt = attendanceList.filter((a: any) => {
        if (String(a.staffId) !== String(s.id)) return false;
        const aDate = new Date(a.date);
        const aMonth = aDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        return aMonth === reqMonth || a.date.startsWith(reqMonth);
      });
      const presentCount = staffAtt.filter((a: any) => a.status === 'PRESENT' || a.checkIn).length;
      const leaveCount = staffAtt.filter((a: any) => a.status === 'LEAVE').length;
      const totalAccounted = presentCount + leaveCount;

      let absences = daysElapsed - totalAccounted;
      if (absences < 0) absences = 0;

      const baseSalary = Number(s.salary) || 0;
      const perDay = baseSalary / daysInMonth;
      const deduction = absences * perDay;
      const finalAmount = Math.max(0, Math.round(baseSalary - deduction));

      const existingRecordIdx = currentPayrolls.findIndex((p: any) => String(p.staffId) === String(s.id) && p.month === reqMonth);
      if (existingRecordIdx >= 0) {
        currentPayrolls[existingRecordIdx].staff = { name: s.name, role: s.role };
        if (currentPayrolls[existingRecordIdx].status === 'PENDING') {
          currentPayrolls[existingRecordIdx].amount = finalAmount;
          currentPayrolls[existingRecordIdx].pendingAmount = Number(finalAmount) - Number(currentPayrolls[existingRecordIdx].paidAmount || 0);
        }
      } else {
        currentPayrolls.push({
          id: `pay-${Date.now()}-${s.id}`,
          staffId: s.id,
          staff: { name: s.name, role: s.role },
          month: reqMonth,
          amount: finalAmount,
          paidAmount: 0,
          pendingAmount: finalAmount,
          status: 'PENDING'
        });
      }
    });

    this.setCollection('mock_admin_payrolls', currentPayrolls);
    return currentPayrolls.filter((p: any) => p.month === reqMonth);
  }
}

export async function routeMockRequest<T>(
  path: string,
  method: string = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Handle explicit dynamic mutations (like Login)
  if (method === 'POST' && path.includes('/auth/login')) {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body || {});
    let role = 'ADMIN';
    let email = 'admin@gymsmart.com';
    let name = 'Demo Admin';
    let isSuspended = false;
    let suspensionMsg = '';

    if (bodyStr.includes('demo_admin')) { 
      role = 'SUPERADMIN'; email = 'demo_admin@gym.com'; name = 'Super Admin'; 
    }
    else if (bodyStr.includes('manager@')) { 
      role = 'MANAGER'; email = 'manager@gymsmart.com'; name = 'Demo Manager'; 
      // Check HR Staff mock DB
      const staffList = MockDB.getCollection('mock_admin_staff', []);
      const manager = staffList.find((s: any) => s.email === email);
      if (manager && manager.isActive === false) {
        isSuspended = true;
        suspensionMsg = 'Your account has been suspended by the Admin.';
      }
    }
    else if (bodyStr.includes('trainer@')) { 
      role = 'TRAINER'; email = 'trainer@gymsmart.com'; name = 'Demo Trainer'; 
      // Check HR Staff mock DB
      const staffList = MockDB.getCollection('mock_admin_staff', []);
      const trainer = staffList.find((s: any) => s.email === email);
      if (trainer && trainer.isActive === false) {
        isSuspended = true;
        suspensionMsg = 'Your account has been suspended by the Admin.';
      }
    } else {
      // Default Admin Login
      const gymsList = MockDB.getCollection('mock_superadmin_gyms', []);
      // Admin owns demo-tenant-id which might be gym-1234 or similar in the mock DB.
      // If we don't know the exact ID, we check if ANY gym owned by sarah@flexfitness.com (or adminEmail) is suspended.
      // Usually, admin logs in to gym-1234. Let's check for gym-1234 specifically or fallback to adminEmail.
      const gym = gymsList.find((g: any) => g.adminEmail === email || g.id === 'gym-1234');
      if (gym && gym.status === 'SUSPENDED') {
        isSuspended = true;
        suspensionMsg = 'Your gym account has been suspended by the Superadmin.';
      }
    }

    if (isSuspended) {
      return {
        success: false,
        message: suspensionMsg,
        data: null
      } as unknown as ApiResponse<T>;
    }
    
    return {
      success: true,
      message: 'Demo Login Successful',
      data: {
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token',
        user: {
          id: 'demo-user-id',
          email,
          name,
          role,
          tenantId: 'demo-tenant-id'
        }
      }
    } as unknown as ApiResponse<T>;
  }

  // Handle explicit dynamic mutations (like Login)
  if (method === 'POST' && path.includes('/impersonate')) {
    return {
      success: true,
      message: 'Impersonation successful',
      data: { token: 'mock-impersonation-token-123' }
    } as unknown as ApiResponse<T>;
  }

  // ==========================================
  // STATEFUL MOCK DB INTERCEPTIONS (Admin/Manager/Trainer)
  // ==========================================
  let parsedBody: any = body;
  if (typeof body === 'string') {
    try { parsedBody = JSON.parse(body); } catch (e) {}
  }

  const generate = (count: number, generator: (i: number) => Record<string, unknown>) => Array.from({ length: count }, (_, i) => generator(i));

  if (path.includes('/store/products')) {
    const existing = MockDB.getCollection('mock_products', []);
    if (existing.length > 0 && existing.some((r: any) => r.name?.includes('Mock Product'))) {
      MockDB.setCollection('mock_products', []);
    }
    const defaultProducts = [
      { id: 'prod-1', name: 'Optimum Nutrition Gold Standard Whey', category: 'Supplements', price: 6500, stock: 15, description: '100% Whey Protein Isolate', isActive: true, unit: '2.27 KG' },
      { id: 'prod-2', name: 'MuscleBlaze Biozyme Performance Whey', category: 'Supplements', price: 2399, stock: 20, description: 'Enhanced absorption whey', isActive: true, unit: '1 KG' },
      { id: 'prod-3', name: 'Cellucor C4 Original Pre-Workout', category: 'Supplements', price: 1800, stock: 45, description: 'Explosive energy pre-workout', isActive: true, unit: '195g' },
      { id: 'prod-4', name: 'ON Micronized Creatine Monohydrate', category: 'Supplements', price: 1200, stock: 35, description: 'Pure unflavored creatine', isActive: true, unit: '300g' },
      { id: 'prod-5', name: 'Scivation Xtend BCAA', category: 'Supplements', price: 2100, stock: 25, description: 'Intra-workout recovery drink', isActive: true, unit: '420g' },
      { id: 'prod-6', name: 'Monster Energy Drink Zero Ultra', category: 'Supplements', price: 150, stock: 50, description: 'Sugar-free energy drink', isActive: true, unit: '500 ML' },
      { id: 'prod-7', name: 'Under Armour Tech 2.0 T-Shirt', category: 'Merchandise', price: 1499, stock: 12, description: 'Breathable dry-fit training tee', isActive: true, unit: 'Large' },
      { id: 'prod-8', name: 'BlenderBottle Classic Shaker', category: 'Accessories', price: 699, stock: 30, description: 'Spill-proof shaker bottle', isActive: true, unit: '800 ML' },
      { id: 'prod-9', name: 'Nivia Python Gym Gloves', category: 'Accessories', price: 450, stock: 18, description: 'Weightlifting gloves with wrist support', isActive: true, unit: 'Medium' },
      { id: 'prod-10', name: 'Rogue Heavy Duty Lifting Belt', category: 'Accessories', price: 3500, stock: 8, description: 'Leather powerlifting belt', isActive: true, unit: '1 Piece' }
    ];
    
    if (existing.length === 0) {
      MockDB.setCollection('mock_products', defaultProducts);
    }
    
    return MockDB.handleCrud('mock_products', method, path, parsedBody, defaultProducts, 'products') as unknown as ApiResponse<T>;
  }

  if (path.includes('/store/summary')) {
    const products = MockDB.getCollection('mock_products', []);
    const orders = MockDB.getCollection('mock_orders', []);
    const revenue = orders.reduce((acc: number, o: any) => acc + (Number(o.total) || 0), 0);
    return { success: true, message: 'Summary', data: { totalProducts: products.length, totalOrders: orders.length, totalRevenue: revenue, lowStockProducts: products.filter((p: any) => Number(p.stock) <= 10) } } as unknown as ApiResponse<T>;
  }

  if (path.includes('/store/orders')) {
    const existing = MockDB.getCollection('mock_orders', []);
    if (existing.length > 0 && existing.some((r: any) => !r.items)) {
       MockDB.setCollection('mock_orders', []);
    }
    if (method === 'POST') {
       const products = MockDB.getCollection('mock_products', []);
       const items = (parsedBody.items || []) as any[];
       items.forEach(item => {
         const prodIdx = products.findIndex(p => String(p.id) === String(item.productId));
         if (prodIdx > -1) {
           products[prodIdx].stock = Math.max(0, Number(products[prodIdx].stock) - Number(item.qty));
         }
       });
       MockDB.setCollection('mock_products', products);
    }
    const defaultOrders = [
      { id: 'ord-1', customerName: 'Demo Customer', total: 1200, method: 'UPI', status: 'COMPLETED', createdAt: new Date().toISOString(), items: [{ productId: 'prod-2', qty: 1, price: 1200, product: { name: 'Creatine Monohydrate', unit: '300g' } }] }
    ];
    
    if (existing.length === 0) {
      MockDB.setCollection('mock_orders', defaultOrders);
    }
    
    return MockDB.handleCrud('mock_orders', method, path, parsedBody, defaultOrders, 'orders') as unknown as ApiResponse<T>;
  }

  if (path.includes(SuperadminUrlConfig.BACKEND_API.FEATURES_BASE)) {
    const defaultFlags = [
      { id: '1', name: 'Beta_Feature_0', description: 'Enable beta features', isGlobalEnabled: false, enabledTenantIds: [] },
      { id: '2', name: 'Beta_Feature_1', description: 'New dashboard', isGlobalEnabled: true, enabledTenantIds: [] },
      { id: '3', name: 'Beta_Feature_2', description: 'Advanced analytics', isGlobalEnabled: false, enabledTenantIds: ['gym-1234'] },
      { id: '4', name: 'Beta_Feature_3', description: 'Custom domains', isGlobalEnabled: true, enabledTenantIds: [] },
    ];
    const defaultNotes = [
      { id: '1', version: 'v1.0.0', title: 'Initial Release', content: 'We are live!', isPublished: true, date: '2023-01-01' }
    ];

    const flags = MockDB.getCollection('mock_superadmin_features', defaultFlags);
    if (flags.length === 0) MockDB.setCollection('mock_superadmin_features', defaultFlags);
    const notes = MockDB.getCollection('mock_superadmin_notes', defaultNotes);
    if (notes.length === 0) MockDB.setCollection('mock_superadmin_notes', defaultNotes);

    if (method === 'GET') {
      return { success: true, message: 'Fetched features', data: { flags, notes } } as unknown as ApiResponse<T>;
    }
    
    if (method === 'PATCH' && path.includes('/flags/')) {
      const segments = path.split('/');
      const isToggle = path.endsWith('/toggle');
      const flagId = isToggle ? segments[segments.length - 2] : segments[segments.length - 1];
      
      const idx = flags.findIndex((f: Record<string, unknown>) => f.id === flagId);
      if (idx > -1) {
        if (isToggle) {
          flags[idx].isGlobalEnabled = !flags[idx].isGlobalEnabled;
        } else {
          flags[idx] = { ...flags[idx], ...parsedBody };
        }
        MockDB.setCollection('mock_superadmin_features', flags);
        return { success: true, message: 'Flag updated', data: flags[idx] } as unknown as ApiResponse<T>;
      }
    }
    
    if (path.includes('/notes')) {
      return MockDB.handleCrud('mock_superadmin_notes', method, path, parsedBody, [], 'notes') as unknown as ApiResponse<T>;
    }
  }

  if (path.includes(SuperadminUrlConfig.BACKEND_API.SETTINGS_BASE)) {
    const defaultSettings = [
      { id: '1', key: 'MAX_GYMS_LIMIT', value: '500', description: 'Maximum total gyms allowed in the system', category: 'platform', dataType: 'number' },
      { id: '2', key: 'MAINTENANCE_MODE', value: 'false', description: 'Suspend all non-admin access', category: 'system', dataType: 'boolean' },
      { id: '3', key: 'DEFAULT_TRIAL_DAYS', value: '14', description: 'Default trial period for new gym signups', category: 'billing', dataType: 'number' },
      { id: '4', key: 'SUPPORT_EMAIL', value: 'support@smartgym.com', description: 'Global support contact email', category: 'general', dataType: 'string' }
    ];
    const settings = MockDB.getCollection('mock_superadmin_settings', defaultSettings);
    if (settings.length === 0) MockDB.setCollection('mock_superadmin_settings', defaultSettings);

    if (method === 'GET') {
      return { success: true, message: 'Settings fetched', data: settings } as unknown as ApiResponse<T>;
    }

    if (method === 'PATCH') {
      const segments = path.split('/');
      const settingId = segments[segments.length - 1];
      const idx = settings.findIndex((s: Record<string, unknown>) => s.id === settingId);
      if (idx > -1) {
        settings[idx] = { ...settings[idx], ...parsedBody };
        MockDB.setCollection('mock_superadmin_settings', settings);
        return { success: true, message: 'Setting updated successfully', data: settings[idx] } as unknown as ApiResponse<T>;
      }
    }
  }

  if (path.includes(SuperadminUrlConfig.BACKEND_API.BROADCASTS_BASE) && method === 'POST') {
    return { success: true, message: 'Broadcast sent successfully to all Admins', data: null } as unknown as ApiResponse<T>;
  }

  if (path.includes(SuperadminUrlConfig.BACKEND_API.INFRASTRUCTURE_BASE)) {
    if (path.includes(SuperadminUrlConfig.BACKEND_API.REDIS_FLUSH_GLOBAL) && method === 'POST') {
      const defaultTelemetry = { memoryUsagePercent: 2, hitRatioPercent: 0, totalKeysCached: 0, uptimeHours: 720 };
      MockDB.setCollection('mock_superadmin_redis_telemetry', [defaultTelemetry]);
      return { success: true, message: 'Global cache flushed' } as unknown as ApiResponse<T>;
    }
    
    if (path.includes(SuperadminUrlConfig.BACKEND_API.REDIS_FLUSH_TENANT) && method === 'POST') {
      let telemetry = MockDB.getCollection('mock_superadmin_redis_telemetry', []);
      if (telemetry.length > 0) {
        const t = telemetry[0] as any;
        const newTelemetry = {
          ...t,
          memoryUsagePercent: Math.max(5, t.memoryUsagePercent - 5),
          totalKeysCached: Math.max(0, t.totalKeysCached - 1000)
        };
        MockDB.setCollection('mock_superadmin_redis_telemetry', [newTelemetry]);
      }
      return { success: true, message: 'Tenant cache flushed' } as unknown as ApiResponse<T>;
    }
    
    if (path.includes(SuperadminUrlConfig.BACKEND_API.REDIS_TELEMETRY) && method === 'GET') {
      const defaultTelemetry = { memoryUsagePercent: 68, hitRatioPercent: 94, totalKeysCached: 1450230, uptimeHours: 720 };
      let telemetry = MockDB.getCollection('mock_superadmin_redis_telemetry', []);
      if (telemetry.length === 0) {
        MockDB.setCollection('mock_superadmin_redis_telemetry', [defaultTelemetry]);
        telemetry = [defaultTelemetry];
      }
      return { success: true, data: telemetry[0], message: 'Fetched Redis telemetry' } as unknown as ApiResponse<T>;
    }

    if (method === 'GET' && !path.includes(SuperadminUrlConfig.BACKEND_API.REDIS_TELEMETRY)) {
      const defaultNodes = generate(6, i => ({
        id: `node-${i}`,
        name: `worker-${i + 1}.internal`,
        cpuPercent: Math.floor(Math.random() * 40) + 10,
        memoryPercent: Math.floor(Math.random() * 30) + 40,
        diskPercent: Math.floor(Math.random() * 20) + 30,
        status: 'ACTIVE'
      }));
      let nodes = MockDB.getCollection('mock_superadmin_infrastructure', []);
      if (nodes.length === 0) {
        MockDB.setCollection('mock_superadmin_infrastructure', defaultNodes);
        nodes = defaultNodes;
      }
      return { success: true, data: nodes } as unknown as ApiResponse<T>;
    }
  }

  if (path.includes('/plans') && !path.includes('/superadmin')) {
    const defaultPlans = generate(3, i => ({ id: `plan-${i}`, name: i === 0 ? 'Basic Plan' : i === 1 ? 'Pro Plan' : 'VIP Plan', tier: i === 0 ? 'Standard' : i === 1 ? 'Premium' : 'Elite', price1Month: 1000 * (i + 1), price3Month: 2500 * (i + 1), price6Month: 4800 * (i + 1), price12Month: 9000 * (i + 1), features: ['Access to gym', 'Locker facility', 'Cardio section'], isActive: true }));
    const existing = MockDB.getCollection('mock_admin_plans', defaultPlans);
    if (existing.length === 0) {
      MockDB.setCollection('mock_admin_plans', defaultPlans);
    }
    return MockDB.handleCrud('mock_admin_plans', method, path, parsedBody, defaultPlans) as unknown as ApiResponse<T>;
  }
  if (path.includes('/members/stats')) return { success: true, message: 'Stats', data: { total: 150, active: 110, pending: 25, expired: 15 } } as unknown as ApiResponse<T>;
  if (path.includes('/members') && !path.includes('/stats') && !path.includes('/superadmin')) {
    let existing = MockDB.getCollection('mock_members', []);
    if (existing.length === 0) {
      const defaultMembers = [
        {
          id: 'GS-01',
          name: 'Aman Verma',
          email: 'aman.verma@example.com',
          phone: '+91 98765 43210',
          gender: 'MALE',
          age: 26,
          branch: 'Main Branch',
          planId: 'plan-1',
          plan: { id: 'plan-1', name: 'Gold Pro Fitness', tier: 'Pro' },
          billingCycle: 'Monthly',
          status: 'ACTIVE',
          joinDate: '2026-01-10',
          expiryDate: '2026-12-31',
          paidAmount: 12000,
          pendingAmount: 0,
          assignedTrainerId: 'demo-trainer-id',
          assignedTrainerName: 'Demo Trainer',
          isPT: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'GS-02',
          name: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '+91 98123 45678',
          gender: 'FEMALE',
          age: 24,
          branch: 'Main Branch',
          planId: 'plan-2',
          plan: { id: 'plan-2', name: 'Elite Annual', tier: 'Elite' },
          billingCycle: 'Quarterly',
          status: 'ACTIVE',
          joinDate: '2026-02-15',
          expiryDate: '2026-11-20',
          paidAmount: 18000,
          pendingAmount: 0,
          assignedTrainerId: 'demo-trainer-id',
          assignedTrainerName: 'Demo Trainer',
          isPT: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'GS-03',
          name: 'Rohan Malhotra',
          email: 'rohan.m@example.com',
          phone: '+91 98987 65432',
          gender: 'MALE',
          age: 29,
          branch: 'Main Branch',
          planId: 'plan-1',
          plan: { id: 'plan-1', name: 'Gold Pro Fitness', tier: 'Pro' },
          billingCycle: 'Annual',
          status: 'ACTIVE',
          joinDate: '2026-03-01',
          expiryDate: '2027-03-01',
          paidAmount: 25000,
          pendingAmount: 0,
          assignedTrainerId: 'demo-trainer-id',
          assignedTrainerName: 'Demo Trainer',
          isPT: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'GS-04',
          name: 'Sneha Patel',
          email: 'sneha.p@example.com',
          phone: '+91 97654 32109',
          gender: 'FEMALE',
          age: 27,
          branch: 'Main Branch',
          planId: 'plan-3',
          plan: { id: 'plan-3', name: 'Basic Fitness', tier: 'Basic' },
          billingCycle: 'Monthly',
          status: 'ACTIVE',
          joinDate: '2026-04-01',
          expiryDate: '2026-10-01',
          paidAmount: 5000,
          pendingAmount: 0,
          assignedTrainerId: 'staff-2',
          assignedTrainerName: 'Staff 2',
          isPT: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'GS-05',
          name: 'Vikram Singh',
          email: 'vikram.singh@example.com',
          phone: '+91 96543 21098',
          gender: 'MALE',
          age: 32,
          branch: 'Main Branch',
          planId: 'plan-2',
          plan: { id: 'plan-2', name: 'Elite Annual', tier: 'Elite' },
          billingCycle: 'Annual',
          status: 'ACTIVE',
          joinDate: '2026-02-01',
          expiryDate: '2027-02-01',
          paidAmount: 24000,
          pendingAmount: 0,
          assignedTrainerId: 'staff-3',
          assignedTrainerName: 'Staff 3',
          isPT: true,
          createdAt: new Date().toISOString()
        }
      ];
      MockDB.setCollection('mock_members', defaultMembers);
      existing = defaultMembers;
    }
    if (existing.length > 0 && existing.some((r: any) => r.name?.includes('Demo Member'))) {
      const filtered = existing.filter((r: any) => !r.name?.includes('Demo Member'));
      MockDB.setCollection('mock_members', filtered);
    }
    
    const res = MockDB.handleCrud('mock_members', method, path, parsedBody, existing, 'members') as unknown as ApiResponse<any>;
    
    // Cascade delete attendance records if a member is deleted
    if (method === 'DELETE' && res.success) {
      const segments = path.split('?')[0].split('/');
      const deletedId = segments[segments.length - 1];
      if (deletedId) {
        const attendanceColl = MockDB.getCollection('mock_admin_attendance', []);
        const updatedAttendance = attendanceColl.filter((a: any) => String(a.memberId) !== String(deletedId));
        MockDB.setCollection('mock_admin_attendance', updatedAttendance);
      }
    }
    
    return res as unknown as ApiResponse<T>;
  }
  if (path.includes('/inquiries/stats')) {
    const existing = MockDB.getCollection('mock_inquiries', []);
    const total = existing.length;
    const newInq = existing.filter((i: any) => i.status === 'NEW').length;
    const converted = existing.filter((i: any) => i.status === 'CONVERTED').length;
    const followUp = existing.filter((i: any) => i.status === 'FOLLOW_UP').length;
    return { success: true, message: 'Stats', data: { total, new: newInq, converted, followUp } } as unknown as ApiResponse<T>;
  }

  if (path.includes('/inquiries') || path.includes('/landing/booking') || path.includes('/landing/contact')) {
    // If it's a landing page POST, we coerce the method to POST for inquiries
    const actualMethod = path.includes('/landing') ? 'POST' : method;
    return MockDB.handleCrud('mock_inquiries', actualMethod, path, parsedBody, [], 'inquiries') as unknown as ApiResponse<T>;
  }
  if (path.includes('/expenses/stats')) {
    const expenses = MockDB.getCollection('mock_admin_expenses', []);
    const totalAmount = expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
    const paidAmount = expenses.filter((e: any) => e.status === 'PAID').reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
    const pendingAmount = expenses.filter((e: any) => e.status === 'PENDING').reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
    const now = new Date();
    const thisMonthAmount = expenses.filter((e: any) => {
      const d = new Date(e.date || e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
    return { success: true, message: 'Stats fetched', data: { totalAmount, paidAmount, pendingAmount, thisMonthAmount } } as unknown as ApiResponse<T>;
  }
  if (path.includes('/expenses')) {
    return MockDB.handleCrud('mock_admin_expenses', method, path, parsedBody, generate(5, i => ({
      id: `exp-${i}`,
      title: i === 0 ? 'Electricity Bill' : i === 1 ? 'Rent' : i === 2 ? 'Equipment Repair' : 'Water Bill',
      category: i === 0 ? 'Electricity' : i === 1 ? 'Rent' : i === 2 ? 'Equipment Maintenance' : 'Miscellaneous',
      amount: i === 0 ? 15000 : i === 1 ? 50000 : i === 2 ? 5000 : 2000,
      date: new Date().toISOString(),
      status: i % 2 === 0 ? 'PAID' : 'PENDING',
      referenceNo: `REF-${1000 + i}`,
      notes: 'Mock generated expense'
    })), 'expenses') as unknown as ApiResponse<T>;
  }
  if (path.includes('/attendance/history')) {
    const url = new URL(`http://localhost${path}`);
    const userId = url.searchParams.get('userId') || 'mock-user';
    const type = url.searchParams.get('type') || 'STAFF';
    const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Fetch actual real data from mock db instead of generating random history
    const allAttendance = MockDB.getCollection('mock_admin_attendance', []);
    const history = allAttendance.filter(r => {
      const rUserId = type === 'STAFF' ? r.staffId : r.memberId;
      const matchesUser = String(rUserId) === String(userId);
      const matchesMonth = typeof r.date === 'string' && r.date.startsWith(month);
      return matchesUser && matchesMonth;
    });
    
    return { success: true, message: 'History fetched', data: history } as unknown as ApiResponse<T>;
  }
  if (path.includes('/attendance/today-stats')) {
    const records = MockDB.getCollection('mock_admin_attendance', []);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => (r.date as string)?.startsWith(todayStr));
    const memberCheckIns = todayRecords.filter(r => r.type === 'MEMBER').length;
    const staffCheckIns = todayRecords.filter(r => r.type === 'STAFF').length;
    return { success: true, message: 'Stats', data: { totalCheckIns: todayRecords.length, memberCheckIns, staffCheckIns } } as unknown as ApiResponse<T>;
  }
  if (path.includes('/attendance')) {
    let existing = MockDB.getCollection('mock_admin_attendance', []);
    
    // Purge old hardcoded format
    if (existing.length > 0 && existing.some((r: any) => r.member?.name?.includes('Member ') || r.staff?.name?.includes('Staff ') || r.member?.name?.includes('Active Member') || r.staff?.name?.includes('Trainer '))) {
      MockDB.setCollection('mock_admin_attendance', []);
      existing = [];
    }
    
    // Purge orphaned records (deleted members/staff)
    if (method === 'GET' && existing.length > 0) {
      const allMembers = MockDB.getCollection('mock_members', []);
      const allStaff = MockDB.getCollection('mock_admin_staff', []);
      
      const memberIds = new Set(allMembers.map(m => String(m.id)));
      const staffIds = new Set(allStaff.map(s => String(s.id)));
      
      const cleaned = existing.filter((r: any) => {
        if (r.type === 'MEMBER') return memberIds.has(String(r.memberId));
        if (r.type === 'STAFF') return staffIds.has(String(r.staffId));
        return true;
      });
      
      if (cleaned.length !== existing.length) {
        MockDB.setCollection('mock_admin_attendance', cleaned);
        existing = cleaned;
      }
    }
    
    return MockDB.handleCrud('mock_admin_attendance', method, path, parsedBody, [], 'attendance') as unknown as ApiResponse<T>;
  }
  if (path.includes('/hr/summary')) {
    const staffList = MockDB.getCollection('mock_admin_staff', []);
    const reqMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const currentPayrolls = MockDB.generatePayrollsForMonth(reqMonth);
    const ledgers = MockDB.getCollection('mock_admin_staff_ledger', []);
    
    const activeStaff = staffList.filter((s: any) => s.isActive).length;
    const paidCount = currentPayrolls.filter((p: any) => p.status === 'PAID' || p.status === 'Paid').length;
    const pendingCount = currentPayrolls.filter((p: any) => p.status === 'PENDING').length;
    
    let totalSalaryThisMonth = 0;
    let totalSalaryPaid = 0;
    let totalSalaryDue = 0;
    let totalAdvanceGiven = 0;
    let pendingPaymentsCount = 0;

    // Calculate from ledgers to be accurate
    ledgers.forEach((l: any) => {
      const d = new Date(l.date);
      const isThisMonth = d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
      if (l.type === 'Salary Generated' && isThisMonth) totalSalaryThisMonth += (l.credit || 0);
      if (l.type === 'Salary Paid' && isThisMonth) totalSalaryPaid += (l.debit || 0);
      if (l.type === 'Advance Given' && isThisMonth) totalAdvanceGiven += (l.debit || 0);
      if (l.type === 'Due Paid' && isThisMonth) totalSalaryPaid += (l.debit || 0);
    });

    // Calculate total due from all staff
    staffList.forEach((s: any) => {
      totalSalaryDue += (Number(s.currentDue) || 0);
      if (Number(s.currentDue) > 0) pendingPaymentsCount++;
    });
    
    return { success: true, message: 'Summary', data: { totalStaff: staffList.length, activeStaff, totalSalaryThisMonth, totalSalaryPaid, totalSalaryDue, totalAdvanceGiven, pendingPaymentsCount } } as unknown as ApiResponse<T>;
  }
  
  if (path.includes('/hr/staff')) {
    const existingStaff = MockDB.getCollection('mock_admin_staff', []);
    if (existingStaff.length > 0 && (existingStaff.some((r: any) => r.name?.includes('Trainer ')) || !existingStaff[0]?.joinDate)) {
      const filtered = existingStaff.filter((r: any) => !r.name?.includes('Trainer ') && r.joinDate);
      MockDB.setCollection('mock_admin_staff', filtered);
    }
    
    const res = MockDB.handleCrud('mock_admin_staff', method, path, parsedBody, [], 'staff') as unknown as ApiResponse<any>;
    
    // Cascade delete attendance and payrolls if a staff member is deleted
    if (method === 'DELETE' && res.success) {
      const segments = path.split('?')[0].split('/');
      const deletedId = segments[segments.length - 1];
      if (deletedId) {
        const attendanceColl = MockDB.getCollection('mock_admin_attendance', []);
        const updatedAttendance = attendanceColl.filter((a: any) => String(a.staffId) !== String(deletedId));
        MockDB.setCollection('mock_admin_attendance', updatedAttendance);
        
        const payrollColl = MockDB.getCollection('mock_admin_payrolls', []);
        const updatedPayrolls = payrollColl.filter((p: any) => String(p.staffId) !== String(deletedId));
        MockDB.setCollection('mock_admin_payrolls', updatedPayrolls);
      }
    }
    
    return res as unknown as ApiResponse<T>;
  }
  
  if (path.includes('/hr/payrolls')) {
    const existingPayrolls = MockDB.getCollection('mock_admin_payrolls', []);
    if (existingPayrolls.length > 0 && existingPayrolls.some((r: any) => r.staff?.name?.includes('Trainer '))) {
      const filtered = existingPayrolls.filter((r: any) => !r.staff?.name?.includes('Trainer '));
      MockDB.setCollection('mock_admin_payrolls', filtered);
    }
    
    if (method === 'GET') {
      const qsMonthMatch = path.match(/month=([^&]+)/);
      const reqMonth = qsMonthMatch ? decodeURIComponent(qsMonthMatch[1]) : new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
      
      const filtered = MockDB.generatePayrollsForMonth(reqMonth);
      return { success: true, message: 'Fetched payrolls', data: { payrolls: filtered, total: filtered.length } } as unknown as ApiResponse<T>;
    }
    
    return MockDB.handleCrud('mock_admin_payrolls', method, path, parsedBody, [], 'payrolls') as unknown as ApiResponse<T>;
  }

  if (path.includes('/hr/ledger')) {
    if (method === 'GET') {
      const segments = path.split('?')[0].split('/');
      const staffId = segments[segments.length - 1];
      const allLedgers = MockDB.getCollection('mock_admin_staff_ledger', []);
      const staffLedger = allLedgers.filter((l: any) => String(l.staffId) === String(staffId)).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return { success: true, message: 'Fetched ledger', data: { ledger: staffLedger, total: staffLedger.length } } as unknown as ApiResponse<T>;
    }
  }

  if (path.includes('/hr/advance')) {
    if (method === 'POST') {
      const { staffId, amount, notes, date, paymentMode } = parsedBody as any;
      const staffList = MockDB.getCollection('mock_admin_staff', []);
      const idx = staffList.findIndex((s: any) => String(s.id) === String(staffId));
      if (idx > -1) {
        staffList[idx].advanceSalary = (Number(staffList[idx].advanceSalary) || 0) + Number(amount);
        MockDB.setCollection('mock_admin_staff', staffList);

        const allLedgers = MockDB.getCollection('mock_admin_staff_ledger', []);
        const staffLedgers = allLedgers.filter((l: any) => String(l.staffId) === String(staffId));
        const lastBalance = staffLedgers.length > 0 ? Number(staffLedgers[staffLedgers.length - 1].balance) : 0;
        
        allLedgers.push({
          id: `ledg-${Date.now()}`,
          staffId,
          date: date || new Date().toISOString(),
          type: 'Advance Given',
          credit: 0,
          debit: Number(amount),
          balance: lastBalance - Number(amount), // debit reduces balance
          notes,
          paymentMode
        });
        MockDB.setCollection('mock_admin_staff_ledger', allLedgers);
        return { success: true, message: 'Advance recorded successfully', data: { advanceAmount: amount } } as unknown as ApiResponse<T>;
      }
    }
  }

  if (path.includes('/hr/due/pay')) {
    if (method === 'POST') {
      const { staffId, amount, notes, date, paymentMode } = parsedBody as any;
      const staffList = MockDB.getCollection('mock_admin_staff', []);
      const idx = staffList.findIndex((s: any) => String(s.id) === String(staffId));
      if (idx > -1) {
        staffList[idx].currentDue = Math.max(0, (Number(staffList[idx].currentDue) || 0) - Number(amount));
        MockDB.setCollection('mock_admin_staff', staffList);

        const allLedgers = MockDB.getCollection('mock_admin_staff_ledger', []);
        const staffLedgers = allLedgers.filter((l: any) => String(l.staffId) === String(staffId));
        const lastBalance = staffLedgers.length > 0 ? Number(staffLedgers[staffLedgers.length - 1].balance) : 0;
        
        allLedgers.push({
          id: `ledg-${Date.now()}`,
          staffId,
          date: date || new Date().toISOString(),
          type: 'Due Paid',
          credit: 0,
          debit: Number(amount),
          balance: lastBalance - Number(amount), 
          notes,
          paymentMode
        });
        MockDB.setCollection('mock_admin_staff_ledger', allLedgers);
        return { success: true, message: 'Due paid successfully', data: { paidAmount: amount } } as unknown as ApiResponse<T>;
      }
    }
  }
  if (path.includes('/exercises')) return MockDB.handleCrud('mock_admin_exercises', method, path, parsedBody, generate(10, i => ({ id: `ex-${i}`, name: `Exercise ${i+1}`, category: 'Strength', muscleGroup: ['Chest', 'Triceps'], difficulty: 'Beginner', isActive: true, videoUrl: '' })), 'exercises') as unknown as ApiResponse<T>;
  
  const existingDiets = MockDB.getCollection('mock_admin_diet_plans', []);
  if (existingDiets.length > 0 && typeof (existingDiets[0] as any).meals?.[0] === 'string') {
    MockDB.setCollection('mock_admin_diet_plans', []); // Force purge old format
  }
  
  if (path.includes('/diet-plans')) {
    const defaultDiets = generate(4, i => ({ 
      id: `diet-${i}`, 
      name: `Pro Diet ${i+1}`, 
      goal: 'Weight Loss', 
      totalCalories: 1500 + (i * 200),
      protein: 120 + i * 10,
      carbs: 150 + i * 20,
      fats: 50 + i * 5,
      meals: [
        { time: '08:00 AM', name: 'Breakfast', calories: 400, foods: ['Oats', 'Eggs', 'Banana'] },
        { time: '01:00 PM', name: 'Lunch', calories: 600, foods: ['Chicken Breast', 'Rice', 'Broccoli'] },
        { time: '07:00 PM', name: 'Dinner', calories: 500, foods: ['Salmon', 'Sweet Potato', 'Asparagus'] }
      ], 
      isActive: true 
    }));
    
    if (MockDB.getCollection('mock_admin_diet_plans', []).length === 0) {
      MockDB.setCollection('mock_admin_diet_plans', defaultDiets);
    }
    
    return MockDB.handleCrud('mock_admin_diet_plans', method, path, parsedBody, defaultDiets, 'dietPlans') as unknown as ApiResponse<T>;
  }

  const existingWorkouts = MockDB.getCollection('mock_workouts', []);
  if (existingWorkouts.length > 0 && typeof (existingWorkouts[0] as any).days === 'number') {
    MockDB.setCollection('mock_workouts', []); // Force purge old format
  }
  if (path.includes('/workouts')) {
    const defaultWorkouts = generate(5, i => ({ 
      id: `wo-${i}`, 
      name: `Hypertrophy Plan ${i+1}`, 
      level: i % 2 === 0 ? 'Intermediate' : 'Beginner',
      focus: 'Hypertrophy',
      days: 4,
      exercises: 15 + i * 2,
      duration: '60 min',
      tags: ['Muscle', 'Strength']
    }));
    
    if (MockDB.getCollection('mock_workouts', []).length === 0) {
      MockDB.setCollection('mock_workouts', defaultWorkouts);
    }
    
    return MockDB.handleCrud('mock_workouts', method, path, parsedBody, defaultWorkouts, 'workouts') as unknown as ApiResponse<T>;
  }
  if (path.includes('/admin/finance/summary')) return { success: true, message: 'Summary', data: { totalRevenue: 1500000, monthlyRevenue: 250000, pendingAmount: 45000, totalPayments: 345, revenueByMethod: { UPI: 120000, Cash: 50000, Card: 80000, NetBanking: 0 }, monthlyData: generate(6, i => ({ month: `M${i+1}`, revenue: 200000 + (i * 10000) })) } } as unknown as ApiResponse<T>;
  if (method === 'GET' && (path.includes('/finance/payments/member/') || path.includes('/finance/payments-by-member/'))) {
    const segments = path.split('?')[0].split('/');
    const memberId = segments[segments.length - 1];
    const allPayments = MockDB.getCollection('mock_admin_payments', []);
    let memberPayments = allPayments.filter((p: any) => String(p.memberId) === String(memberId));
    
    if (memberPayments.length === 0) {
       const newPayment = {
         id: `pay-mock-${Date.now()}`,
         memberId: memberId,
         amount: 3000,
         method: 'UPI',
         status: 'PAID',
         paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
         invoiceNo: `INV-MOCK-${Date.now().toString().slice(-6)}`
       };
       allPayments.push(newPayment);
       MockDB.setCollection('mock_admin_payments', allPayments);
       memberPayments = [newPayment];
    }

    return { success: true, message: 'Fetched member payments', data: memberPayments } as unknown as ApiResponse<T>;
  }
  if (path.includes('/finance/payments')) return MockDB.handleCrud('mock_admin_payments', method, path, parsedBody, generate(10, i => ({ id: `pay-${i}`, memberId: `mem-${i}`, member: { name: `Payer ${i}`, email: `payer${i}@example.com`, phone: '9988776655', plan: { name: 'Pro Plan' } }, amount: 5000 + (i * 500), status: 'PAID', paidAt: new Date().toISOString(), method: 'UPI', invoiceNo: `INV-${1000 + i}` })), 'payments') as unknown as ApiResponse<T>;
  if (path.includes('/admin/settings')) {
    if (method === 'GET') {
      const settings = MockDB.getCollection('mock_admin_settings', [{ gymName: 'Demo Gym Base', ownerName: 'Admin Owner', phone: '9988776655', email: 'admin@gym.com', city: 'Mumbai', gstNumber: '27AAAAA1234A1Z5' }]);
      return { success: true, message: 'Fetched Settings', data: settings[0] } as unknown as ApiResponse<T>;
    } else {
      const parsed = typeof body === 'string' ? JSON.parse(body) : (body as Record<string, unknown>);
      MockDB.setCollection('mock_admin_settings', [parsed]);
      return { success: true, message: 'Settings Saved', data: parsed } as unknown as ApiResponse<T>;
    }
  }
  if (path.includes('/settings')) return MockDB.handleCrud('mock_settings', method, path, parsedBody, generate(1, i => ({ id: `setting-${i}`, gymName: 'Demo Gym Base', currency: 'INR', timezone: 'Asia/Kolkata', emailNotifications: true }))) as unknown as ApiResponse<T>;

  if (path.includes('/store/summary')) {
    const products = MockDB.getCollection('mock_store_products', []);
    const orders = MockDB.getCollection('mock_orders_v2', []);
    return { success: true, message: 'Store Summary', data: { totalProducts: products.length, totalOrders: orders.length, totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0), lowStockProducts: products.filter((p: any) => p.stock <= 5) } } as unknown as ApiResponse<T>;
  }


  if (path.includes('/admin/branches')) {
    const defaultBranches = [
      {
        id: 'b1', name: 'Downtown Core', location: '123 Main St', status: 'active',
        revenue: 125000, expenses: 45000, studentsCount: 450, staffCount: 12,
        revenueItems: [
          { id: 'r1', label: 'Membership Fee — Rahul Sharma', amount: 4500, method: 'UPI', date: '2026-09-01' },
          { id: 'r2', label: 'Membership Fee — Priya Singh', amount: 3000, method: 'Cash', date: '2026-09-02' },
          { id: 'r3', label: 'Store Sale — Protein Powder', amount: 850, method: 'Card', date: '2026-09-02' },
          { id: 'r4', label: 'Personal Training — Amit Verma', amount: 5000, method: 'UPI', date: '2026-09-03' },
        ],
        expenseItems: [
          { id: 'e1', label: 'Electricity Bill', amount: 12000, category: 'Utilities', date: '2026-09-01' },
          { id: 'e2', label: 'Staff Salaries', amount: 24000, category: 'Payroll', date: '2026-09-01' },
          { id: 'e3', label: 'Equipment Maintenance', amount: 5000, category: 'Maintenance', date: '2026-09-03' },
          { id: 'e4', label: 'Cleaning Supplies', amount: 2000, category: 'Operations', date: '2026-09-03' },
        ],
        staffList: [
          { id: 's1', name: 'Vikram Patel', role: 'Manager', shift: 'Morning', status: 'active' },
          { id: 's2', name: 'Sunita Rao', role: 'Trainer', shift: 'Evening', status: 'active' },
          { id: 's3', name: 'Arjun Mehta', role: 'Trainer', shift: 'Morning', status: 'on-leave' },
          { id: 's4', name: 'Kavya Nair', role: 'Receptionist', shift: 'Full-day', status: 'active' },
        ],
        studentList: [
          { id: 'st1', name: 'Rahul Sharma', plan: 'Premium', status: 'active', joinDate: '2026-01-15' },
          { id: 'st2', name: 'Priya Singh', plan: 'Basic', status: 'active', joinDate: '2026-03-10' },
          { id: 'st3', name: 'Amit Verma', plan: 'Personal Training', status: 'active', joinDate: '2026-07-01' },
        ],
      },
      {
        id: 'b2', name: 'Uptown Plaza', location: '456 North Ave', status: 'active',
        revenue: 85000, expenses: 32000, studentsCount: 320, staffCount: 8,
        revenueItems: [
          { id: 'r5', label: 'Membership Fee — Neha Gupta', amount: 3000, method: 'UPI', date: '2026-09-01' },
          { id: 'r6', label: 'Store Sale — Gym Gloves', amount: 450, method: 'Cash', date: '2026-09-02' },
        ],
        expenseItems: [
          { id: 'e5', label: 'Electricity Bill', amount: 9000, category: 'Utilities', date: '2026-09-01' },
          { id: 'e6', label: 'Staff Salaries', amount: 18000, category: 'Payroll', date: '2026-09-01' },
        ],
        staffList: [
          { id: 's5', name: 'Deepak Kumar', role: 'Manager', shift: 'Morning', status: 'active' },
          { id: 's6', name: 'Pooja Iyer', role: 'Trainer', shift: 'Evening', status: 'active' },
        ],
        studentList: [
          { id: 'st4', name: 'Neha Gupta', plan: 'Basic', status: 'active', joinDate: '2026-02-20' },
        ],
      },
      {
        id: 'b3', name: 'Westside Mall', location: '789 West Blvd', status: 'active',
        revenue: 150000, expenses: 55000, studentsCount: 600, staffCount: 15,
        revenueItems: [
          { id: 'r7', label: 'Membership Fee — Ravi Teja', amount: 4500, method: 'Card', date: '2026-09-01' },
          { id: 'r8', label: 'Personal Training — Sneha Roy', amount: 6000, method: 'UPI', date: '2026-09-03' },
        ],
        expenseItems: [
          { id: 'e7', label: 'Electricity Bill', amount: 15000, category: 'Utilities', date: '2026-09-01' },
          { id: 'e8', label: 'Staff Salaries', amount: 30000, category: 'Payroll', date: '2026-09-01' },
          { id: 'e9', label: 'Marketing', amount: 8000, category: 'Marketing', date: '2026-09-02' },
        ],
        staffList: [
          { id: 's7', name: 'Anita Sharma', role: 'Manager', shift: 'Morning', status: 'active' },
          { id: 's8', name: 'Ravi Teja', role: 'Trainer', shift: 'Morning', status: 'active' },
          { id: 's9', name: 'Sneha Roy', role: 'Trainer', shift: 'Evening', status: 'on-leave' },
        ],
        studentList: [
          { id: 'st5', name: 'Ravi Teja', plan: 'Premium', status: 'active', joinDate: '2026-01-10' },
          { id: 'st6', name: 'Sneha Roy', plan: 'Personal Training', status: 'expired', joinDate: '2025-12-01' },
        ],
      },
    ];
    return MockDB.handleCrud('mock_admin_branches', method, path, parsedBody, defaultBranches) as unknown as ApiResponse<T>;
  }

  // SUPERADMIN Stateful Interceptions
  if (path.includes('/superadmin/tickets')) return MockDB.handleCrud('mock_tickets', method, path, parsedBody, generate(10, i => ({ id: `tkt-${i}`, tenantName: `Gym Branch ${i + 1}`, subject: `Billing Issue ${i}`, status: i % 3 === 0 ? 'RESOLVED' : 'OPEN', priority: i % 4 === 0 ? 'HIGH' : 'LOW', createdAt: '2023-10-10', lastUpdated: '2023-10-12' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/invoices')) return MockDB.handleCrud('mock_invoices', method, path, parsedBody, generate(12, i => ({ id: `inv-${i}`, tenantName: `Gym Branch ${i + 1}`, amount: 5000 + (i * 1000), currency: 'INR', status: i % 4 === 0 ? 'PENDING' : 'PAID', date: '2023-11-01', planName: 'Enterprise' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/coupons')) return MockDB.handleCrud('mock_coupons', method, path, parsedBody, generate(5, i => ({ id: `coup-${i}`, code: `WELCOME${i * 10}`, discountType: 'PERCENTAGE', discountValue: 10 + i, maxUses: 100, currentUses: 20 * i, status: 'ACTIVE', expiryDate: '2024-12-31', isDeleted: false }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/affiliates')) return MockDB.handleCrud('mock_affiliates', method, path, parsedBody, generate(6, i => ({ id: `aff-${i}`, name: `Partner ${i + 1}`, email: `partner${i}@example.com`, referralCode: `REF${i}00`, totalReferred: 5 * i, commissionEarned: 1000 * i, status: 'ACTIVE', joinedAt: '2023-05-01' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/broadcasts')) return MockDB.handleCrud('mock_broadcasts', method, path, parsedBody, generate(4, i => ({ id: `bc-${i}`, title: `System Update v${i}.0`, content: 'Important update details.', status: i === 0 ? 'DRAFT' : 'SENT', audience: 'ALL_TENANTS', scheduledDate: null, sentDate: '2023-10-01' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/system') || path.includes('/superadmin/infrastructure')) return MockDB.handleCrud('mock_infrastructure', method, path, parsedBody, generate(3, i => ({ id: `node-${i}`, name: `Production Node ${i + 1}`, cpuPercent: 30 + (i * 15), memoryPercent: 45 + (i * 10), diskPercent: 60 - (i * 5), status: 'Healthy' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/jobs')) return MockDB.handleCrud('mock_jobs', method, path, parsedBody, generate(12, (i: number) => {
    const statuses = ['COMPLETED', 'ACTIVE', 'FAILED', 'DELAYED'];
    const status = statuses[i % statuses.length];
    const isFailed = status === 'FAILED';
    const isCompleted = status === 'COMPLETED';
    const queues = ['billing', 'email', 'webhook', 'database'];
    const queueName = queues[i % queues.length];
    const jobNames: Record<string, string[]> = {
      'billing': ['process_invoice', 'renew_subscription', 'charge_card'],
      'email': ['send_welcome', 'send_receipt', 'send_newsletter'],
      'webhook': ['trigger_zapier', 'sync_crm'],
      'database': ['backup', 'cleanup_logs']
    };
    const jobName = jobNames[queueName][i % jobNames[queueName].length];
    
    return { 
      id: `job-${1000 + i}`, 
      queueName, 
      jobName, 
      status, 
      attempts: isFailed ? 3 : 1, 
      createdAt: '2023-11-05T08:00:00Z',
      finishedAt: (isCompleted || isFailed) ? '2023-11-05T08:05:00Z' : undefined,
      durationMs: (isCompleted || isFailed) ? (1500 + i * 200) : undefined,
      error: isFailed ? 'ConnectionTimeoutError: Failed to reach external API endpoint after 30000ms.' : undefined,
      payload: {
        tenantId: `tenant-${i}`,
        action: jobName,
        metadata: { retryCount: i, source: 'cron' }
      }
    };
  }), 'jobs') as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/backups')) return MockDB.handleCrud('mock_backups', method, path, parsedBody, generate(5, i => ({ id: `bup-${i}`, tenantName: `Gym Branch ${i + 1}`, databaseName: `db_gym_${i}`, sizeMB: 150 + (i * 50), status: 'SUCCESS', timestamp: '2023-11-05' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/audit-logs')) return MockDB.handleCrud('mock_audit_logs', method, path, parsedBody, generate(15, i => ({ id: `log-${i}`, actorName: 'Demo Admin', actorRole: 'SUPERADMIN', action: 'UPDATE_TENANT', targetResource: `tenant-${i}`, timestamp: '2023-11-05', ipAddress: '192.168.1.1' }))) as unknown as ApiResponse<T>;
  if (path.includes('/admin/audit')) return MockDB.handleCrud('mock_admin_audit', method, path, parsedBody, generate(12, i => ({ id: `audit-${i}`, actorId: `admin-${i}`, actorRole: 'ADMIN', action: i % 2 === 0 ? 'CREATE' : 'UPDATE', entityType: i % 3 === 0 ? 'MEMBER' : 'PAYMENT', entityId: `entity-${i}`, oldValue: null, newValue: { foo: 'bar' }, ipAddress: '127.0.0.1', timestamp: new Date().toISOString() })), 'logs') as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/settings')) return MockDB.handleCrud('mock_settings', method, path, parsedBody, generate(6, i => ({ id: `set-${i}`, key: `ALLOW_SIGNUPS_${i}`, value: 'true', description: 'Enable signups', category: 'General', dataType: 'boolean' }))) as unknown as ApiResponse<T>;
  if (path.includes('/tenants') || path.includes('/gyms') || path.includes('/superadmin/gyms')) return MockDB.handleCrud('mock_tenants', method, path, parsedBody, generate(8, i => ({ id: `tenant-${i}`, name: `Gym Branch ${i + 1}`, ownerName: 'Admin Owner', adminEmail: `admin${i}@gym.com`, phone: `998877665${i}`, status: 'ACTIVE', plan: 'Enterprise', createdAt: '2023-01-01', memberCount: 150 + (i * 20), monthlyRevenue: 50000 + (i * 5000), databaseVersion: 'v1.0' }))) as unknown as ApiResponse<T>;
  if (path.includes('/superadmin/plans')) return MockDB.handleCrud('mock_saas_plans', method, path, parsedBody, generate(3, i => ({ id: `saas-plan-${i}`, name: i === 0 ? 'Starter' : i === 1 ? 'Pro' : 'Enterprise', priceMonthly: 1000 * (i + 1), priceAnnual: 10000 * (i + 1), maxMembers: 100 * (i + 1), maxStaff: 5 * (i + 1), features: ['CRM', 'Billing', 'Analytics'], activeTenants: 10 * (i + 1) }))) as unknown as ApiResponse<T>;
  // For features and migrations, which return compound objects in GET, we let GET bypass or handle specifically.
  if (path.includes('/superadmin/features')) {
    if (method === 'GET') {
      const flags = MockDB.getCollection('mock_flags', generate(4, i => ({ id: `flag-${i}`, name: `Beta_Feature_${i}`, description: 'A beta feature', isGlobalEnabled: true, enabledTenantIds: [] })));
      const notes = MockDB.getCollection('mock_notes', generate(3, i => ({ id: `note-${i}`, version: `v1.${i}`, title: `Update ${i}`, content: 'Feature update.', isPublished: true, date: '2023-11-01' })));
      return { success: true, message: 'Fetched features compound data', data: { flags, notes } } as unknown as ApiResponse<T>;
    }
    if (path.includes('/notes')) return MockDB.handleCrud('mock_notes', method, path, parsedBody, []) as unknown as ApiResponse<T>;
    return MockDB.handleCrud('mock_flags', method, path, parsedBody, []) as unknown as ApiResponse<T>;
  }
  if (path.includes('/superadmin/migrations')) {
    if (method === 'GET') {
      const migrations = MockDB.getCollection('mock_migrations', generate(3, i => ({ id: `mig-${i}`, name: `Add_Stripe_ID_${i}`, appliedAt: '2023-11-01', status: 'SUCCESS' })));
      const tenants = MockDB.getCollection('mock_tenants', generate(8, i => ({ id: `tenant-${i}`, name: `Gym Branch ${i + 1}`, ownerName: 'Admin Owner', adminEmail: `admin${i}@gym.com`, phone: `998877665${i}`, status: 'ACTIVE', plan: 'Enterprise', createdAt: '2023-01-01', memberCount: 150 + (i * 20), monthlyRevenue: 50000 + (i * 5000), databaseVersion: 'v1.0' })));
      return { success: true, message: 'Fetched migrations compound data', data: { migrations, tenants } } as unknown as ApiResponse<T>;
    }
    return MockDB.handleCrud('mock_migrations', method, path, parsedBody, [], 'migrations') as unknown as ApiResponse<T>;
  }

  if (path.includes('/superadmin/usage-meters')) {
    return MockDB.handleCrud('mock_usage_meters', method, path, parsedBody, generate(5, i => ({
      id: `meter-${i}`,
      tenantId: `tenant-${i}`,
      tenantName: `Gym Branch ${i + 1}`,
      smsSent: 850 + (i * 45),
      smsLimit: 1000,
      databaseGb: parseFloat((0.5 + (i * 0.15)).toFixed(2)),
      mediaGb: parseFloat((4.0 + (i * 1.05)).toFixed(2)),
      storageLimitGb: 10,
      activeMembers: 95 + (i * 20),
      memberLimit: 100 + (i * 30),
      billingCycleEnd: '2023-11-30'
    }))) as unknown as ApiResponse<T>;
  }

  if (path.includes('/superadmin/analytics/revenue')) {
    return {
      success: true,
      message: 'Fetched revenue analytics',
      data: {
        mrr: 125000,
        arr: 1500000,
        churnRate: 1.5,
        ltv: 4500,
        cac: 120,
        activeTenants: 145
      }
    } as unknown as ApiResponse<T>;
  }

  // Dynamic Rich Data Generator for Demo Mode
  if (method === 'GET') {
    // Helper to generate an array
    const generate = (count: number, generator: (i: number) => Record<string, unknown>) => Array.from({ length: count }, (_, i) => generator(i));

    if (path.includes('/superadmin/dashboard')) {
      return {
        success: true, message: 'Superadmin Dashboard Mock',
        data: {
          metrics: {
            monthlyRecurringRevenue: 1250000,
            totalGyms: 45,
            activeGyms: 42,
            totalEndUsers: 15420,
            recentOnboards: generate(5, i => ({
              id: `tenant-${i}`, name: `Demo Gym ${i}`, ownerName: `Owner ${i}`, plan: i % 2 === 0 ? 'Enterprise' : 'Pro', createdAt: '2023-10-01'
            }))
          },
          revenue: [
            { month: 'Jan', mrr: 1000000 }, { month: 'Feb', mrr: 1100000 },
            { month: 'Mar', mrr: 1150000 }, { month: 'Apr', mrr: 1250000 }
          ],
          growth: []
        }
      } as unknown as ApiResponse<T>;
    }

    if (path.includes('/admin/dashboard') || path.includes('/manager/dashboard') || path.includes('/trainer/dashboard') || path.includes('/dashboard')) {
      let rawMembers = MockDB.getCollection('mock_members', []);
      let payments = MockDB.getCollection('mock_admin_payments', []);
      let staff = MockDB.getCollection('mock_admin_staff', []);
      const plans = MockDB.getCollection('mock_admin_plans', []);
      const inquiries = MockDB.getCollection('mock_inquiries', []);
      const storeOrders = MockDB.getCollection('mock_store_orders', []);
      
      // Members will only be populated via conversions now, no dummy generation.
      
      if (payments.length === 0) {
        payments = generate(10, (i: number) => ({ id: `pay-${i}`, memberId: `GS-${15102023000 + i}`, member: { name: `Member ${i + 1}` }, amount: 5000, status: 'PAID', paidAt: new Date().toISOString(), method: 'UPI', invoiceNo: `INV-${1000 + i}` }));
        MockDB.setCollection('mock_admin_payments', payments);
      }
      
      if (staff.length === 0) {
        staff = generate(8, (i: number) => {
          if (i === 0) {
            return {
              id: `staff-${i}`, name: `Rajesh Manager`, email: 'manager@gymsmart.com', role: 'Manager', status: 'ACTIVE', isActive: true, salary: 45000, joinDate: new Date().toISOString(), branch: 'b1', primaryBranchId: 'b1', assignedBranches: ['b1', 'b3', 'b5']
            };
          }
          return { id: `staff-${i}`, name: `Staff ${i + 1}`, role: 'Trainer', status: 'ACTIVE', isActive: true, salary: 25000, joinDate: new Date().toISOString(), branch: 'b1' };
        });
        MockDB.setCollection('mock_admin_staff', staff);
      }
      
      // Apply fallbacks because form submission might miss 'status' or 'plan' object
      const members = rawMembers.map((m: any) => {
        const p = m.plan || plans.find((x: any) => String(x.id) === String(m.planId)) || { name: 'Unknown Plan' };
        return {
          ...m,
          status: m.status ? m.status.toUpperCase() : 'ACTIVE',
          plan: p
        };
      });

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Members stats
      const totalMembers = members.length;
      const activeMembers = members.filter((m: any) => m.status === 'ACTIVE').length;
      const pendingMembers = members.filter((m: any) => m.status === 'PENDING').length;
      const expiredMembers = members.filter((m: any) => m.status === 'EXPIRED').length;
      const newMembersThisMonth = members.filter((m: any) => {
        const d = new Date(m.joinDate || m.createdAt || now);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // Revenue stats (Memberships + Store POS)
      const validPayments = payments.filter((p: any) => p.status === 'PAID');
      
      let totalRevenue = validPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      let monthlyRevenue = validPayments.filter((p: any) => {
        const d = new Date(p.paidAt || p.createdAt || now);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      
      // Add Store Orders to revenue
      const validStoreOrders = storeOrders.filter((o: any) => o.status === 'COMPLETED' || !o.status);
      totalRevenue += validStoreOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      monthlyRevenue += validStoreOrders.filter((o: any) => {
        const d = new Date(o.createdAt || now);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

      // Pending payments
      const pendingPayments = members.reduce((sum: number, m: any) => sum + (Number(m.pendingAmount) || 0), 0);

      // Staff stats
      const totalStaff = staff.length;
      const activeStaff = staff.filter((s: any) => s.status === 'ACTIVE' || s.isActive === true).length;

      // Inquiries stats
      const totalInquiries = inquiries.length;
      const newInquiries = inquiries.filter((inq: any) => {
        const d = new Date(inq.createdAt || inq.date || now);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // Plan groupings
      const membersByPlanMap: Record<string, number> = {};
      members.forEach((m: any) => {
        const planName = m.plan?.name || 'Unknown';
        membersByPlanMap[planName] = (membersByPlanMap[planName] || 0) + 1;
      });
      const membersByPlan = Object.entries(membersByPlanMap).map(([plan, count]) => ({ plan, count }));

      // Recent items
      const recentMembers = [...members].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);
      const recentPayments = [...validPayments].sort((a: any, b: any) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime()).slice(0, 5);
      const pendingPaymentsList = members.filter((m: any) => m.pendingAmount > 0).sort((a: any, b: any) => b.pendingAmount - a.pendingAmount).slice(0, 5);

      // Expiring items
      const expiringMemberships = members.filter((m: any) => m.status === 'ACTIVE').slice(0, 3);

      return {
        success: true, message: 'Demo Dashboard (Live Mock)',
        data: {
          todayAttendance: 45,
          trainerAttendance: { present: 5, total: 6 },
          totalMembers, 
          activeMembers, 
          newMembersThisMonth,
          totalRevenue,
          monthlyRevenue, 
          pendingPayments,
          totalStaff,
          activeStaff,
          totalProducts: 120, // Mocked for now
          lowStockCount: 5,   // Mocked for now
          totalInquiries,
          newInquiries,
          membersByStatus: { active: activeMembers, pending: pendingMembers, expired: expiredMembers },
          memberGrowth: [
            { month: 'Jan', count: Math.max(0, totalMembers - 30) },
            { month: 'Feb', count: Math.max(0, totalMembers - 20) },
            { month: 'Mar', count: Math.max(0, totalMembers - 10) },
            { month: 'Apr', count: totalMembers }
          ],
          revenueChart: [
            { month: 'Jan', revenue: Math.max(0, monthlyRevenue - 50000) },
            { month: 'Feb', revenue: Math.max(0, monthlyRevenue - 30000) },
            { month: 'Mar', revenue: Math.max(0, monthlyRevenue - 10000) },
            { month: 'Apr', revenue: monthlyRevenue }
          ],
          membersByPlan: membersByPlan.length > 0 ? membersByPlan : [{ plan: 'Basic', count: 0 }],
          recentMembers,
          recentPayments,
          pendingPaymentsList,
          expiringMemberships
        }
      } as unknown as ApiResponse<T>;
    }
    
    // Removed /members, /inquiries, /attendance (now handled by MockDB stateful routing)

    // Removed /finance and /superadmin/plans (handled by MockDB stateful routing)

    // Removed /plans, /store (now handled by MockDB)
    
    // Superadmin Mock Generics removed (now handled by MockDB stateful routing)

    // Removed /erp/hr, /erp/workout, /erp/library (now handled by MockDB)
    if (path.includes('/sales/overview')) {
      return { success: true, message: 'Demo Sales Overview', data: {
        monthlyRevenue: generate(6, i => ({ month: `Month ${i+1}`, revenue: 300000 + (i * 15000), storeRevenue: 50000 + (i * 8000), expenses: 100000 + (i * 5000), newMembers: 20 + i * 5 }))
      }} as unknown as ApiResponse<T>;
    }
    if (path.includes('/sales/membership-report')) {
      return { success: true, message: 'Demo Membership Report', data: {
        report: generate(5, i => ({ plan: `Plan ${i+1}`, receivable: 50000 * (i+1), received: 40000 * (i+1), remaining: 10000 * (i+1), refund: 0 })),
        totals: { totalReceivable: 750000, totalReceived: 600000, remaining: 150000, refunds: 0 }
      }} as unknown as ApiResponse<T>;
    }
    if (path.includes('/sales/pending-payments')) {
      return { success: true, message: 'Demo Pending Payments', data: {
        members: generate(6, i => ({ id: `mem-${i}`, name: `Defaulter ${i+1}`, pendingAmount: 5000, dueDate: '2023-11-01' })),
        total: 6
      }} as unknown as ApiResponse<T>;
    }
    if (path.includes('/sales/all-memberships')) {
      return { success: true, message: 'Demo All Memberships', data: {
        members: generate(10, i => {
          const now = Date.now();
          // Mix of statuses: 5 Active, 2 Expiring Soon (3 days), 3 Expired (-5 days)
          let status = 'ACTIVE';
          let expiry = now + 30 * 24 * 60 * 60 * 1000;
          
          if (i > 4 && i <= 6) {
             expiry = now + 3 * 24 * 60 * 60 * 1000; // Expiring in 3 days
          } else if (i > 6) {
             status = 'EXPIRED';
             expiry = now - 5 * 24 * 60 * 60 * 1000; // Expired 5 days ago
          }

          return { 
            id: `all-mem-${i}`, name: `Member ${i+1}`, phone: '1234567890', email: `mem${i}@test.com`,
            status, billingCycle: '1 Month', paidAmount: 5000, pendingAmount: 0,
            joinDate: new Date(now - 60*24*60*60*1000).toISOString(), expiryDate: new Date(expiry).toISOString(),
            planId: 'basic', gender: 'MALE', branch: 'Main', createdAt: new Date().toISOString()
          };
        }),
        total: 10
      }} as unknown as ApiResponse<T>;
    }
    // End removed
    // Removed /settings (handled by MockDB stateful routing)

    // Default list fallback
    return {
      success: true, message: `Demo Mode: Action ${method} ${path} successful`,
      data: []
    } as unknown as ApiResponse<T>;
  }

  // Generic fallback if no specific mock is found for mutations (POST, PUT, DELETE)
  // Removed console.log per Rule 46
  // parsedBody is already defined and parsed at the top of the function
  
  const safeData = {
    id: `mock-id-${Date.now()}`,
    ...parsedBody,
    status: parsedBody.status || 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    message: `Demo Mode: Action ${method} ${path} successful`,
    data: safeData as unknown as T,
  };
}
