import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';


const DrawerSkeleton = () => {
  return (
    <Box sx={{ px: 2, pt: 1 }}>
      {[0, 1, 2].map((g) => (
        <Box key={g} sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              mb: 1
            }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={220} height={28} />
            <Box sx={{ flex: 1 }} />
            <Skeleton variant="rectangular" width={90} height={28} />
          </Stack>
          {[0, 1, 2, 3].map((r) => (
            <Stack
              key={r}
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
                py: 1,
                px: 1
              }}>
              <Skeleton variant="rectangular" width={20} height={20} />
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={22} />
                <Skeleton variant="text" width="40%" height={18} />
              </Box>
              <Skeleton variant="rectangular" width={80} height={24} />
            </Stack>
          ))}
        </Box>
      ))}
    </Box>
  );
};

const BodySkeleton = (props) => {
  if (props.variant === 'drawer') {
    return <DrawerSkeleton />;
  }

  return (
    <Box
      sx={{
        px: 2,
        pt: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: 300,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 7].map((g) => {
        return (
          <Stack
            key={g}
            data-testid="skeleton-row"
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              mb: 1
            }}>
            <Skeleton
              data-testid="skeleton-text"
              variant="text"
              width={240}
              height={28}
            />
            <Box sx={{ flex: 1 }} />
            <Skeleton
              data-testid="skeleton-rect"
              variant="rectangular"
              width={28}
              height={28}
            />
          </Stack>
        );
      })}
    </Box>
  );
};

export default BodySkeleton;
