import moment from 'moment';
export default {
  name: 'dayTime',
  filter(value) {
    if (!value) return ' ';
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
}