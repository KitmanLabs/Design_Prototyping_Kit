import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

export default function FormBuilderHeader({ productArea, category, createdAt, creator, description }) {
  return (
    <Box sx={{ px: 0 }}>
      <Grid container spacing={5}>
        <Grid item>
          <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>Product area</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{productArea}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>Category</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{category}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>Created</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{createdAt}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>Creator</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{creator}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>Description</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>{description}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}


