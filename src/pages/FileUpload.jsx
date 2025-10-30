import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Breadcrumbs as MuiBreadcrumbs,
    Divider as MuiDivider,
    Card as MuiCard,
    FormControl as MuiFormControl,
    TextField as MuiTextField,
    LinearProgress,
} from '@mui/material';
import {Helmet} from "react-helmet-async";
// import {NavLink} from "react-router-dom";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';


const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const TextField = styled(MuiTextField)(spacing);


function FileUpload() {

    const [files, setFiles] = useState([]);
    const [progress, setProgress] = React.useState(0);

    const onDrop = useCallback(async (acceptedFiles) => {
        console.log(acceptedFiles);
        // setFile(acceptedFiles[0]);
        // setFiles(acceptedFiles);
        // setFiles((prev) => [...prev, ...acceptedFiles]);
        const newFiles = acceptedFiles.map((file) => ({
            id: Date.now() + file.name,
            file,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // setProgress(0);
        //
        // let current = 0;
        // const timer = setInterval(() => {
        //     current += 10;
        //     setProgress(current);
        //     if (current >= 100) clearInterval(timer);
        // }, 200);

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("http://localhost:3000/uploads", {
                    method: "POST",
                    body: formData,
                });

                console.log("POST結果:", res.status);
            } catch (err) {
                console.error("送信失敗:", err);
            }
        }

    }, []);

    const formatFileSizeMB = (bytes) => {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2) + ' MB';
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <Paper sx={{p: 4, display: "flex", flexDirection: "column", mt: 2,}}>
            <Typography variant="h4">
                ファイルアップロード
            </Typography>
            <Box
                {...getRootProps()}
                sx={{
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px dotted #9e9e9e",
                    borderColor: (theme) =>
                        isDragActive ? theme.palette.primary.main : theme.palette.divider,
                    backgroundColor: (theme) =>
                        isDragActive ? theme.palette.action.hover : "transparent",
                    mt: 6,
                    mb: 6,
                    width: 500,
                    height: 100,
                }}
            >
                <UploadFileIcon sx={{mb: 4}}/>
                <input{...getInputProps()} />
                <Typography sx={{fontSize: 15}}>ファイルをドラック&ドロップ</Typography>
            </Box>

            {files.map(({id, file}) => (
                <Card
                    key={id}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        width: 500,
                        p: 4,
                        justifyContent: "space-between",
                    }}
                >
                    <UploadFileIcon/>
                    <Box sx={{ml: 5, flex: 1}}>
                        <Typography variant="body1">
                            {file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatFileSizeMB(file.size)}
                        </Typography>
                        <Box>
                            <LinearProgress variant="determinate" value={progress} sx={{mt: 1, maxWidth: 300}}/>
                        </Box>
                    </Box>
                    <DeleteIcon onClick={() => {
                        setFiles((prev) => prev.filter((f) => f.id !== id));
                    }}/>
                </Card>
            ))}

        </Paper>
    );
}

function Settings() {
    return (
        <React.Fragment>
            <Grid justifyContent="space-between" container spacing={10}>
                <Helmet title="ファイルアップロード"/>
                <Grid>
                    <Typography variant="h3" gutterBottom display="inline">
                        ファイルアップロード
                    </Typography>
                    {/*<Breadcrumbs aria-label="Breadcrumb" mt={2}>*/}
                    {/*    <Link component={NavLink} to="/">*/}
                    {/*        社員管理*/}
                    {/*    </Link>*/}
                    {/*    <Typography>設定</Typography>*/}
                    {/*</Breadcrumbs>*/}
                </Grid>
            </Grid>

            <Divider my={6}/>
            <Grid container spacing={6}>
                <Grid size={12}>
                    <FileUpload/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Settings;


