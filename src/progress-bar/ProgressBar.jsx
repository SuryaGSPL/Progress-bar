import React, { useState, useEffect, useRef } from 'react'
import './ProgressBar.css'
import LinearProgress from '@mui/material/LinearProgress';
import { IconButton, Paper, Stack } from '@mui/material';
import { PlayArrowRounded, PauseRounded, FastRewindRounded, FastForwardRounded } from '@mui/icons-material';
// Video Progress Bar




function ProgressBar() {

    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const progressBarRef = useRef(null);
    // Fast forward and rewind duration
    const difference = 10;

    // To minically make the progress bar playing
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = isPlaying ? 1 : 0; // Smaller increment for smoother progress
                return Math.min(oldProgress + diff, 100); // 100 is the max value of progress
            });
        }, 500); // Shorter interval for smoother progress

        return () => {
            clearInterval(timer);
        };
    }, [isPlaying]);

    const playPause = () => {
        setIsPlaying(!isPlaying);
    }
    const fastForward = () => {
        setProgress((oldProgress) => Math.min(oldProgress + difference, 100));
    };

    const rewind = () => {
        setProgress((oldProgress) => Math.max(oldProgress - difference, 0));
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
        setProgress(Math.min(Math.max(newProgress, 0), 100));
      };

    return (
        <Stack direction={"row"} spacing={2}>
            <Paper sx={{ width: '100%', p: 2 }} elevation={4}>

                <div
                    ref={progressBarRef}
                   
                    onMouseDown={handleMouseDown}
                >

                    <LinearProgress className='progress-bar' variant="determinate" value={progress} />

                </div>

                <Stack className='control-panel' direction={"row"} spacing={2} >
                    {/* Align controls to the center of the screen */}
                    <IconButton className='control' onClick={rewind}><FastRewindRounded /></IconButton>
                    <IconButton className='control' onClick={playPause}>{isPlaying ? <PauseRounded /> : <PlayArrowRounded />}</IconButton>
                    <IconButton className='control' onClick={fastForward}><FastForwardRounded /></IconButton>
                </Stack>

            </Paper>

        </Stack>
    )
}


export default ProgressBar