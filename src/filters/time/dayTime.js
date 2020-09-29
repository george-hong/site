import dayjs from 'dayjs';
export default {
  name: 'dayTime',
  filter(value) {
    if (!value) return ' ';
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  }
}