import React, { useEffect, useState } from "react";
import { generateIconColorMode, generateLinkColorMode } from "../design/style/enable-dark-mode";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { CustomTextField } from "../design/partials/custom-material-textfield";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import authService from "../service/auth-service"; // Updated import (singleton instance)
import { useThemeContext } from "../context/theme-context";
import { useAuthContext } from "../context/auth-context";
import UserModel from "../model/user-model";
import { useAlertContext } from "../context/alert-context";
import { FeedbackModel } from "../model/feedback-model";
import UUIDv4 from "../utils/uuid-generator";
import { useLoaderContext } from "../context/loader-context";
import { FooterComponent } from "../design/utils/footer-component";

interface LoginComponentType {}

export const LoginComponent: React.FunctionComponent<LoginComponentType> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { theme } = useThemeContext();
    const { setUser } = useAuthContext();
    const { setLoading } = useLoaderContext();
    const { alerts, setAlerts } = useAlertContext();

    useEffect(() => {
        document.title = 'Login | FLM';
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        switch (e.target.name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            default:
                throw new Error("Invalid field");
        }
    };

    const submitLogin = (event: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in event && event.key !== 'Enter') return;
        if (!username || !password) return;
        login();
    };

    const login = async () => {
        setLoading(true);
        try {
            const userData = await authService.authenticate(username, password);
            setAlerts([
                ...alerts,
                new FeedbackModel(UUIDv4(), "You are connected", "info", true)
            ]);
            setUser(userData);
            history.push("/");
        } catch (error: any) {
            setAlerts([
                ...alerts,
                new FeedbackModel(
                    UUIDv4(),
                    error.message || "Login failed",
                    "error",
                    true
                )
            ]);
            setUsername("");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={theme} style={{ height: "calc(100% - 64px)", width: "100%" }}>
            <div className={"main-register-form"}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <LockIcon
                        fontSize={"large"}
                        className={generateIconColorMode(theme)}
                    />
                </div>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CustomTextField
                                id={"loginUsernameInput"}
                                label={"Username"}
                                name={"username"}
                                value={username}
                                isDarkModeEnable={theme}
                                handleChange={handleChange}
                                isMultiline={false}
                                type={"text"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                id={"loginPasswordInput"}
                                label={"Password"}
                                name={"password"}
                                value={password}
                                isDarkModeEnable={theme}
                                handleChange={handleChange}
                                type={"password"}
                                isMultiline={false}
                                keyUp={submitLogin}
                            />
                        </Grid>
                    </Grid>
                    <div>
                        <Grid item xs={12}>
                            <Button
                                className={"button-register-form"}
                                style={{ marginTop: "15px" }}
                                onClick={submitLogin}
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Sign in
                            </Button>
                        </Grid>
                    </div>
                    <Grid container direction="row" justify="space-between">
                        <Link
                            className={"lnk"}
                            style={{ color: generateLinkColorMode(theme) }}
                            to={"/forgot-password"}
                        >
                            Forgot your password?
                        </Link>
                        <Link
                            className={"lnk"}
                            style={{ color: generateLinkColorMode(theme) }}
                            to={"/register"}
                        >
                            Sign up
                        </Link>
                    </Grid>
                </div>
                <FooterComponent />
            </div>
        </div>
    );
};