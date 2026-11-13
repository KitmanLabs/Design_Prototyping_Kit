import Button from '@mui/material/Button';


export default function AthleteSelectorTrigger({
  onOpen,
  label,
  disabled = false,
  open,
  id,
}) {
  return (
    <Button
      variant="contained"
      onClick={onOpen}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open === true ? 'true' : 'false'}
      {...(id ? { 'aria-controls': id } : {})}
    >
      {label}
    </Button>
  );
}
