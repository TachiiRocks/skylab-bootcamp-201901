// User

export const SUPERADMIN_ROLE = 'SUPERADMIN_ROLE';
export const BUSINESS_ROLE = 'BUSINESS_ROLE';
export const ADMIN_ROLE = 'ADMIN_ROLE';
export const STAFF_ROLE = 'STAFF_ROLE';
export const USER_ROLE = 'USER_ROLE';
export const GUEST_ROLE = 'GUEST_ROLE';
export const ROLES = [SUPERADMIN_ROLE, BUSINESS_ROLE, ADMIN_ROLE, STAFF_ROLE, USER_ROLE, GUEST_ROLE];

// Session

export const ACTIVE = 'ACTIVE';
export const CANCELLED = 'CANCELLED';
export const FINISHED = 'FINISHED';
export const CLOSED = 'CLOSED';
export const FULL = 'FULL';

export const SESSIONSTATUS = [ACTIVE, CANCELLED, FINISHED, CLOSED, FULL];

export const PUBLIC = 'PUBLIC';
export const ONLY_REGISTERED = 'ONLY_REGISTERED';
export const OWN_CUSTOMERS = 'OWN_CUSTOMERS';
export const OWN_STAFF = 'OWN_STAFF';
export const PRIVATE = 'PRIVATE';

export const SESSIONVISIBILITY = [PUBLIC, ONLY_REGISTERED, OWN_CUSTOMERS, OWN_STAFF, PRIVATE];

// Request

export const REQUESTBECUSTOMER = 'REQUESTBECUSTOMER';
export const REQUESTBEPROVIDER = 'REQUESTBEPROVIDER';

export const REQUESTTYPES = [REQUESTBECUSTOMER, REQUESTBEPROVIDER];

export const CANCEL = 'CANCEL';
export const ACCEPT = 'ACCEPT';
export const DENIEDBYUSER = 'DENIEDBYUSER';
export const DENIEDBYPROVIDER = 'DENIEDBYPROVIDER';
export const PENDING = 'PENDING';
export const BLOCKEDBYUSER = 'BLOCKEDBYUSER';
export const BLOCKEDBYPROVIDER = 'BLOCKEDBYPROVIDER';

export const REQUESTSTATUS = [
  ACCEPT,
  DENIEDBYUSER,
  DENIEDBYPROVIDER,
  PENDING,
  BLOCKEDBYUSER,
  BLOCKEDBYPROVIDER,
  CANCEL,
];

// Attendance

export const PAIDINADVANCE = 'PAIDINADVANCE';
export const TOPAYINSESSION = 'TOPAYINSESSION';
export const POSTPAID = 'POSTPAID';
export const INCLUDED = 'INCLUDED';
export const FREE = 'FREE';

export const ATTENDANCEPAYMENTTYPES = [PAIDINADVANCE, TOPAYINSESSION, POSTPAID, INCLUDED, FREE];

export const CANCELLEDBYPROVIDER = 'CANCELLEDBYPROVIDER';
export const CANCELLEDBYUSER = 'CANCELLEDBYUSER';
export const CONFIRMED = 'CONFIRMED';
export const OK = 'OK';
export const NOSHOW = 'NOSHOW';
export const ATTENDED = 'ATTENDED';
export const PENDINGAPPROVAL = 'PENDINGAPPROVAL';
export const PENDINGCANCELLATION = 'PENDINGCANCELLATION';
export const NOCOUNT = 'NOCOUNT';

export const AttendanceStatusesInfo = {
  CANCELLEDBYPROVIDER: {
    title: 'Cancelled by provider',
    sort: 90,
  },
  CONFIRMED: {
    title: 'Confirmed',
    sort: 20,
  },
  OK: {
    title: 'Ok',
    sort: 21,
  },
  NOSHOW: {
    title: 'No show',
    sort: 31,
  },
  ATTENDED: {
    title: 'Attended',
    sort: 30,
  },
  PENDINGAPPROVAL: {
    title: 'Pending approval',
    sort: 11,
  },
  PENDINGCANCELLATION: {
    title: 'Pending Cancellation',
    sort: 12,
  },
  NOCOUNT: {
    title: 'No count',
    sort: 50,
  },
  CANCELLEDBYUSER: {
    title: 'Cancelled by user',
    sort: 99,
  },
};

export const ATTENDANCESTATUSES = [
  CANCELLEDBYPROVIDER,
  CANCELLEDBYUSER,
  CONFIRMED,
  OK,
  NOSHOW,
  ATTENDED,
  PENDINGAPPROVAL,
  PENDINGCANCELLATION,
  NOCOUNT,
];

export const ATTENDANCEDEFAULTS = [OK, PENDINGAPPROVAL];
export const ATTENDANCECOUNTSTATUSES = [CONFIRMED, NOSHOW, ATTENDED, PENDINGAPPROVAL];
export const ATTENDANCENOCOUNTSTATUSES = [CANCELLEDBYPROVIDER, CANCELLEDBYUSER, NOCOUNT];
