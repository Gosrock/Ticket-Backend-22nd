// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { BlockedUserDto } from '../dtos/BlockedUserList.dto';
// import { UserIdDto } from '../dtos/UserId.dto';

// export const ReqUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     // console.log('asdfasdfasd');

//     const userObj = request.user;
//     // console.log('check null', userObj.blockedUsers);
//     userObj.blockedUserDto = new BlockedUserDto(userObj.blockedUsers);
//     userObj.userIdDto = new UserIdDto(userObj._id);
//     // console.log(userObj);

//     return userObj;
//   }
// );
