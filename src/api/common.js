import request from '@/utils/request'

export const reCAPTCHA = (reCAPTCHA) => {
  return request.post('/common/reCAPTCHA', null, {
    params: {
      reCAPTCHA: reCAPTCHA
    }
  })
}
