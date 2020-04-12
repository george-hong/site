import { Notification } from 'element-ui';

const message = {
  show(config) {
    return Notification(config);
  },
  success(config) {
    return Notification({
      ...config,
      type: 'success'
    });
  },
  error(config) {
    return Notification({
      ...config,
      type: 'error'
    });
  },
  warning(config) {
    return Notification({
      ...config,
      type: 'warning'
    });
  },
  info(config) {
    return Notification({
      ...config,
      type: 'info'
    });
  }
};

export default message;