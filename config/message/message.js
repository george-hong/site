import { Notification } from 'element-ui';

const message = {
  show(config) {
    return Notification(config);
  },
  success(config) {
    return Notification({
      duration: 3000,
      ...config,
      type: 'success'
    });
  },
  error(config) {
    return Notification({
      duration: 3000,
      ...config,
      type: 'error'
    });
  },
  warning(config) {
    return Notification({
      duration: 3000,
      ...config,
      type: 'warning'
    });
  },
  info(config) {
    return Notification({
      duration: 3000,
      ...config,
      type: 'info'
    });
  }
};

export default message;