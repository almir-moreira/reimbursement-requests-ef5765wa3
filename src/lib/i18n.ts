import useAuthStore from '@/stores/useAuthStore'

const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    requests: 'Requests',
    masterData: 'Master Data',
    logout: 'Logout',
    newRequest: 'New Request',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    approve: 'Approve',
    reject: 'Reject',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    bankInfo: 'Bank Information',
    expenseDetails: 'Expense Details',
    attachments: 'Attachments',
    printPdf: 'Print PDF',
    Pending: 'Pending',
    Checked: 'Checked',
    Approved: 'Approved',
    Paid: 'Paid',
    Rejected: 'Rejected',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    profile: 'الملف الشخصي',
    requests: 'الطلبات',
    masterData: 'البيانات الرئيسية',
    logout: 'تسجيل خروج',
    newRequest: 'طلب جديد',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    approve: 'موافقة',
    reject: 'رفض',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'إجراءات',
    bankInfo: 'المعلومات المصرفية',
    expenseDetails: 'تفاصيل النفقات',
    attachments: 'المرفقات',
    printPdf: 'طباعة PDF',
    Pending: 'قيد الانتظار',
    Checked: 'تم الفحص',
    Approved: 'موافق عليه',
    Paid: 'مدفوع',
    Rejected: 'مرفوض',
  },
}

export function useTranslation() {
  const { lang } = useAuthStore()
  const t = (key: string): string => translations[lang]?.[key] || key
  return { t, lang }
}
