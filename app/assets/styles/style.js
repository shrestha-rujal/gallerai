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
  justifyBetween: {
    justifyContent: 'space-between',
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
  button: {
    backgroundColor: theme.colors.golden,
    paddingVertical: theme.sizes.padding * 1,
    paddingHorizontal: theme.sizes.padding * 1.5,
    borderRadius: theme.sizes.radius,
  },
});
