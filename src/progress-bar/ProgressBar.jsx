import React, { useState, useEffect, useRef } from 'react';
import './ProgressBar.css';
import LinearProgress from '@mui/material/LinearProgress';
import { IconButton, Paper, Stack, TextField, Typography, Box } from '@mui/material';
import { PlayArrowRounded, PauseRounded, FastRewindRounded, FastForwardRounded } from '@mui/icons-material';

function ProgressBar() {
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2023-12-31');
    const [currentDate, setCurrentDate] = useState(new Date(startDate));
    const [isPlaying, setIsPlaying] = useState(true);
    const progressBarRef = useRef(null);
    const difference = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

    const totalDuration = new Date(endDate) - new Date(startDate);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate((oldDate) => {
                if (oldDate >= new Date(endDate)) {
                    return new Date(startDate);
                }
                const newDate = isPlaying ? new Date(oldDate.getTime() + 24 * 60 * 60 * 1000) : oldDate;
                return newDate > new Date(endDate) ? new Date(endDate) : newDate;
            });
        }, 500); // Adjust this for smoother progress

        return () => {
            clearInterval(timer);
        };
    }, [isPlaying, startDate, endDate]);

    const calculateProgress = () => {
        const elapsedTime = currentDate - new Date(startDate);
        return (elapsedTime / totalDuration) * 100;
    };

    const playPause = () => {
        setIsPlaying(!isPlaying);
    };

    const fastForward = () => {
        setCurrentDate((oldDate) => {
            const newDate = new Date(oldDate.getTime() + difference);
            return newDate > new Date(endDate) ? new Date(endDate) : newDate;
        });
    };

    const rewind = () => {
        setCurrentDate((oldDate) => {
            const newDate = new Date(oldDate.getTime() - difference);
            return newDate < new Date(startDate) ? new Date(startDate) : newDate;
        });
    };

    const handleMouseDown = (event) => {
        updateProgress(event);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event) => {
        updateProgress(event);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const updateProgress = (event) => {
        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const newProgress = (offsetX / rect.width) * 100;
        const newDate = new Date(new Date(startDate).getTime() + (newProgress / 100) * totalDuration);
        setCurrentDate(newDate);
    };

    const generateMonthLabels = () => {
        const labels = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;

        for (let i = 0; i < months; i++) {
            const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const position = ((date - start) / totalDuration) * 100;
            labels.push({ month: date.toLocaleString('default', { month: 'short' }), position });
        }

        return labels;
    };

    const monthLabels = generateMonthLabels();

    return (
        <Stack direction={"column"} spacing={2}>

            {/* Input Panel */}
            <Paper sx={{ width: 'fit-content', p: 2 }} elevation={4}>
                <form className='input-panel'>
                    <label>Start Date</label>
                    <TextField
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label>End Date</label>
                    <TextField
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </form>
            </Paper>

            {/* Info Panel */}
            <div>
                <Paper className='info-panel' sx={{ color: 'primary.main', fontWeight: 'bold' }} elevation={4}>
                    <Typography className='info'>{currentDate.toDateString()}</Typography>
                </Paper>
            </div>

            {/* Progress Bar and Controls */}
            <Paper sx={{ width: '100%', p: 2, position: 'relative' }} elevation={4}>
                <div
                    ref={progressBarRef}
                    onMouseDown={handleMouseDown}
                    style={{ position: 'relative' }}
                >
                    <LinearProgress className='progress-bar' variant="determinate" value={calculateProgress()} />
                    {/* Month Labels */}
                <Box className='month-labels' sx={{ position: 'relative', width: '100%', marginTop: '10px' }}>
                    {monthLabels.map((label, index) => (
                        <Typography
                            key={index}
                            sx={{
                                position: 'absolute',
                                left: `${label.position}%`,
                                transform: 'translateX(-50%)',
                                fontSize: '0.75rem'
                            }}
                        >
                            {label.month}
                        </Typography>
                    ))}
                </Box>
                </div>

                <Stack className='control-panel' direction={"row"} spacing={2}>
                    <IconButton className='control' onClick={rewind}><FastRewindRounded /></IconButton>
                    <IconButton className='control' onClick={playPause}>{isPlaying ? <PauseRounded /> : <PlayArrowRounded />}</IconButton>
                    <IconButton className='control' onClick={fastForward}><FastForwardRounded /></IconButton>
                </Stack>

                
            </Paper>
        </Stack>
    );
}

export default ProgressBar;
