import { SetMetadata } from '@nestjs/common'

/** AccessTokenGuard 가 포함된 controller 내부에서
 * AccessToken 없이 접근할 수 있도록 해주는 데코레이터입니다 */
export const NoAuth = () => SetMetadata('no-auth', true)