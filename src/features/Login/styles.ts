/* npm imports: material-ui/core */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((_theme: Theme) =>
	createStyles({
		root: {},
		typography: {
			paddingTop: 20,
			paddingBottom: 20,
		},
	})
);
