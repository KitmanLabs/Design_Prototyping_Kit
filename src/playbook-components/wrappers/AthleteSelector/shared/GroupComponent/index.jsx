import { useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import i18n from '@kitman/common/src/utils/i18n';


const GroupComponent = ({
  group,
  selectedIds,
  setSelectedIds,
  expandedSections,
  handleGroupToggle,
  renderAthletes,
}) => {
  const isExpanded = expandedSections[group.key] || false;

  const allAthleteIds = useMemo(() => {
    const collectIds = (g) => [
      ...(g.athletes?.map((a) => Number(a.id)) ?? []),
      ...(g.children ? g.children.flatMap(collectIds) : []),
    ];
    return collectIds(group);
  }, [group]);

  const isAllSelected =
    allAthleteIds.length > 0 &&
    allAthleteIds.every((id) => selectedIds.has(id));

  const selectedCount = allAthleteIds.filter((id) =>
    selectedIds.has(id)
  ).length;

  const handleSelectToggle = (e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      allAthleteIds.forEach((id) => {
        if (isAllSelected) updated.delete(id);
        else updated.add(id);
      });
      return updated;
    });
  };

  return (
    <Accordion
      disableGutters
      expanded={isExpanded}
      onChange={() => handleGroupToggle(group.key)}
    >
      <AccordionSummary
        expandIcon={null}
        sx={{
          padding: 0,
          '& .expandIcon': {
            transform: 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          },
          '&.Mui-expanded .expandIcon': {
            transform: 'rotate(180deg)',
          },
          '& .MuiAccordionSummary-content': {
            margin: 0,
            padding: '8px 16px',
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
            padding: '8px 16px',
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            width: '100%',
            margin: 0
          }}>
          <ExpandMoreIcon className="expandIcon" />
          <Box sx={{
            flex: 1
          }}>
            <Typography>{`${group.title} ${
              selectedCount ? `(${selectedCount})` : ''
            }`}</Typography>
            {group.subtitle && (
              <Typography
                variant="subtitle"
                sx={{ color: 'text.secondary', opacity: 0.6 }}
              >
                {group.subtitle}
              </Typography>
            )}
          </Box>
          <Button
            size="medium"
            variant="text"
            onClick={handleSelectToggle}
            sx={{ fontWeight: 400, fontSize: '14px' }}
          >
            {isAllSelected ? i18n.t('Clear all') : i18n.t('Select all')}
          </Button>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ paddingRight: 0, paddingTop: 0 }}>
        {isExpanded && (
          <>
            {group.athletes && renderAthletes(group.athletes)}
            {group.children?.length > 0 && (
              <Box sx={{
                ml: 1
              }}>
                {group.children.map((childGroup) => (
                  <GroupComponent
                    key={childGroup.key}
                    group={childGroup}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    expandedSections={expandedSections}
                    handleGroupToggle={handleGroupToggle}
                    renderAthletes={renderAthletes}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupComponent;
