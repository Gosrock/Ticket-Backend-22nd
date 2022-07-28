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

enum PageOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

enum OrderStatus {
  WAIT = '확인대기',
  DONE = '입금확인',
  EXPIRE = '기한만료'
}

enum EnterDate {
  YB = '09.01',
  OB = '09.02'
}

enum TicketStatus {
  DONE = '입장완료',
  // 원래 WAIT = "입장대기" 였음 ENTERWAIT이라고 생각하면될듯
  ENTERWAIT = '입금확인',
  ORDERWAIT = '확인대기',
  EXPIRE = '기한만료'
}

enum JWTType {
  ACCESS = 'ACCESS_SECRET',
  REGISTER = 'REGISTER_SECRET'
}

export {
  Role,
  OrderDate,
  PerformanceDate,
  TicketStatus,
  PageOrder,
  OrderStatus,
  EnterDate,
  JWTType
};
