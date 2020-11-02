import {StyleSheet} from 'react-native';
import theme from '../theme';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  margined: {
    margin: theme.sizes.margin,
  },
  padded: {
    padding: theme.sizes.padding,
  },
  elevated: {
    elevation: theme.sizes.elevation,
  },
});
