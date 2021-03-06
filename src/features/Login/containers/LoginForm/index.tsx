/* npm imports: common */
import React, { useState, useMemo, useCallback } from 'react';

/* npm imports: material-ui/core */
import Paper from '@material-ui/core/Paper';

/* root imports: graphql */
import {
	useLoginMutation,
	useRegisterMutation,
	CurrentUserDocument,
} from 'generated/graphql';

/* root imports: common */
import {
	UsernameInput,
	PasswordInput,
	LoginTabs,
	LoginButton,
} from 'features/Login/components';

/* local imports: common */
import { useStyles } from './styles';

const LoginForm: React.FC = () => {
	const classes = useStyles();

	const [tabIndex, setTabIndex] = useState(0);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	const [login] = useLoginMutation({
		update: (cache, { data: loginData }) => {
			cache.writeQuery({
				query: CurrentUserDocument,
				data: { currentUser: loginData && loginData.login },
			});
		},
	});

	const [register] = useRegisterMutation({
		update: (cache, { data: registerData }) => {
			cache.writeQuery({
				query: CurrentUserDocument,
				data: { currentUser: registerData && registerData.register },
			});
		},
	});

	const isPasswordCorrect = useMemo(() => password === repeatPassword, [
		password,
		repeatPassword,
	]);

	const isLoginReady = useMemo(() => !!username && !!password, [password, username]);

	const isRegistrationReady = useMemo(() => isLoginReady && isPasswordCorrect, [
		isLoginReady,
		isPasswordCorrect,
	]);

	const tabClickHandler = useCallback((_e: React.ChangeEvent<{}>, value: number) => {
		setTabIndex(value);
	}, []);

	const usernameChangeHandler = useCallback(({ target }) => {
		setUsername(target.value);
	}, []);

	const passwordChangeHandler = useCallback(({ target }) => {
		setPassword(target.value);
	}, []);

	const repeatPasswordChangeHandler = useCallback(({ target }) => {
		setRepeatPassword(target.value);
	}, []);

	const loginHandler = (): void => {
		const userData = {
			username,
			password,
		};

		if (isLoginReady) login({ variables: userData });
	};

	const registrationHandler = (): void => {
		const userData = {
			username,
			password,
		};

		if (isRegistrationReady) register({ variables: userData });
	};

	return (
		<Paper className={classes.paper}>
			<LoginTabs tabIndex={tabIndex} onChange={tabClickHandler} />
			<div className={classes.wrapper}>
				<UsernameInput value={username} onChange={usernameChangeHandler} />
				<PasswordInput value={password} onChange={passwordChangeHandler} />
				{tabIndex === 0 && (
					<LoginButton
						marginTop={14}
						gradient="secondary"
						onClick={loginHandler}
					>
						Login
					</LoginButton>
				)}
				{tabIndex === 1 && (
					<>
						<PasswordInput
							repeatPassword
							value={repeatPassword}
							onChange={repeatPasswordChangeHandler}
						/>
						<LoginButton
							marginTop={14}
							gradient="secondary"
							onClick={registrationHandler}
						>
							Register
						</LoginButton>
					</>
				)}
			</div>
		</Paper>
	);
};

export { LoginForm };
