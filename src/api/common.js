import request from '@/api/request'

export const reCAPTCHA = reCAPTCHA => {
  return request.post('/common/reCAPTCHA', null, {
    params: {
      reCAPTCHA: reCAPTCHA,
    },
  })
}
