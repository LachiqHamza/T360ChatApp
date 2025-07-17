import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { CustomTextField } from "../design/partials/custom-material-textfield";
import Button from "@material-ui/core/Button";
import authService from '../service/auth-service';
import { useHistory } from "react-router-dom";
import { useThemeContext } from "../context/theme-context";
import { useAlertContext } from "../context/alert-context";
import { FeedbackModel } from "../model/feedback-model";
import UUIDv4 from "../utils/uuid-generator";

export const CreateGroupComponent = () => {
    const history = useHistory();
    const [groupName, setGroupName] = useState("");
    const { theme } = useThemeContext();
    const { alerts, setAlerts } = useAlertContext();
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        document.title = "Create group | FLM";
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGroupName(event.target.value);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            createGroup(event);
        }
    }

    async function createGroup(event: React.FormEvent) {
        event.preventDefault();
        if (!groupName.trim()) {
            setAlerts([...alerts, new FeedbackModel(
                UUIDv4(),
                "Group name cannot be empty",
                "error",
                true
            )]);
            return;
        }

        setIsCreating(true);
        try {
            const response = await authService.createGroup(groupName.trim());
            setAlerts([...alerts, new FeedbackModel(
                UUIDv4(),
                `Group "${groupName}" created successfully`,
                "success",
                true
            )]);
            history.push({
                pathname: `/t/messages/${response.data}`,
                state: { groupCreated: true }
            });
        } catch (err: unknown) {
            let errorMessage = "Failed to create group";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setAlerts([...alerts, new FeedbackModel(
                UUIDv4(),
                errorMessage,
                "error",
                true
            )]);
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className={theme} style={{ height: "calc(100% - 64px)", textAlign: "center", paddingTop: "40px" }}>
            <Container className={"clrcstm"} component="main" maxWidth="xs">
                <CssBaseline />
                <div className={"main-register-form clrcstm"}>
                    <Typography className={"clrcstm"} variant="h6">
                        Create a group
                    </Typography>
                </div>
                <div className={"clrcstm"}>
                    <Grid className={"clrcstm"} container spacing={2}>
                        <Grid className={"clrcstm"} item xs={12}>
                            <CustomTextField
                                id={"createGroupMessenger"}
                                label={"Type a name for your group"}
                                name={"groupName"}
                                handleChange={handleChange}
                                value={groupName}
                                type={"text"}
                                keyUp={handleKeyDown}
                                isDarkModeEnable={theme}
                                isMultiline={false}
                            />
                        </Grid>
                        <div>
                            <Grid item xs={12}>
                                <Button
                                    className={"button-register-form"}
                                    style={{ marginTop: "15px" }}
                                    onClick={createGroup}
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    disabled={isCreating || !groupName.trim()}
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </Button>
                            </Grid>
                        </div>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};