enum Role {
  User = 'User',
  Admin = 'Admin'
}

enum OrderDate {
  BOTH = 'BOTH',
  YB = 'YB',
  OB = 'OB'
}

enum PerformanceDate {
  YB = 'YB',
  OB = 'OB'
}

enum OrderStatus {
  WAIT = '확인대기',
  DONE = '입금확인',
  EXPIRE = '기한만료'
}

enum TicketStatus {
  DONE = '입장완료',
  WAIT = '입장대기'
}

enum JWTType {
  ACCESS = 'ACCESS_SECRET',
  REGISTER = 'REGISTER_SECRET'
}

export { Role, OrderDate, PerformanceDate, TicketStatus, OrderStatus, JWTType };
