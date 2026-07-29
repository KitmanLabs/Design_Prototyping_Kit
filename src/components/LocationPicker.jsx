import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
} from '@mui/material';
import { LocationOnOutlined, LocationOn, SearchOutlined } from '@mui/icons-material';
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '../config/googleMaps';

const mapContainerStyle = {
  width: '100%',
  height: '140px',
};

const pickerMapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 51.481581,
  lng: -0.190883,
};

const formFieldStyles = {
  '& .MuiInputBase-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--placeholder-font-weight)',
    fontFamily: 'var(--font-family-primary)',
    '&.Mui-focused': { color: 'var(--color-border-focus)' },
  },
  '& .MuiFilledInput-root': {
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--radius-sm)',
    '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
    '&.Mui-focused': { backgroundColor: 'var(--color-background-primary)' },
    '&:before': { borderBottom: '1px solid var(--color-border-primary)' },
    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid var(--color-border-focus)' },
    '&.Mui-focused:after': { borderBottom: '2px solid var(--color-border-focus)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-family-primary)',
    '&::placeholder': {
      color: 'var(--placeholder-color) !important',
      opacity: '1 !important',
      fontFamily: 'var(--placeholder-font-family) !important',
      fontSize: 'var(--placeholder-font-size) !important',
      fontWeight: 'var(--placeholder-font-weight) !important',
    },
  },
};

const LocationPicker = ({ value, onChange, onLocationChange, savedLocations = [] }) => {
  const [searchValue, setSearchValue] = useState(value || '');
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // ─── Map picker ("Choose on map") — fixed centre pin, map pans beneath ──
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [pickerCenter, setPickerCenter] = useState(defaultCenter);
  const [pickerAddress, setPickerAddress] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pinDragging, setPinDragging] = useState(false);
  const pickerMapRef = useRef(null);
  const pickerAutocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Mock location suggestions with coordinates for demo purposes
  const mockLocationSuggestions = [
    { name: "Emirates stadium", address: 'Hornsey Road, London N7 7AJ, United Kingdom', lat: 51.5549, lng: -0.1084 },
    { name: "Tottenham hotspur stadium", address: '782 High Road, London N17 0BX, United Kingdom', lat: 51.6042, lng: -0.0662 },
    { name: 'Anfield', address: 'Anfield Road, Liverpool L4 0TH, United Kingdom', lat: 53.4308, lng: -2.9608 },
    { name: "Etihad stadium", address: 'Ashton New Road, Manchester M11 3FF, United Kingdom', lat: 53.4831, lng: -2.2004 },
    { name: "Villa park", address: 'Trinity Road, Birmingham B6 6HE, United Kingdom', lat: 52.5092, lng: -1.8850 },
    { name: "St james park", address: 'Barrack Road, Newcastle upon Tyne NE1 4ST, United Kingdom', lat: 54.9756, lng: -1.6217 },
    { name: "London stadium", address: 'Queen Elizabeth Olympic Park, London E20 2ST, United Kingdom', lat: 51.5383, lng: -0.0163 },
    { name: "Stamford bridge training ground", address: 'Cobham, Surrey KT11 3PT, United Kingdom', lat: 51.3259, lng: -0.4473 },
    { name: 'Crystal Palace FC', address: 'Holmesdale Road, London SE25 6PU, United Kingdom', lat: 51.3983, lng: -0.0853 },
    { name: "Brentford community stadium", address: '166 Lionel Road, Brentford TW8 9QT, United Kingdom', lat: 51.4908, lng: -0.2889 },
  ];

  useEffect(() => {
    if (value !== searchValue) {
      setSearchValue(value || '');
    }
  }, [value, searchValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange(newValue);
    
    // Clear selected location when user starts typing again
    setSelectedLocation(null);
    
    // Show autocomplete suggestions when typing
    if (newValue.trim().length > 0) {
      setShowSavedLocations(true);
      setShowSuggestions(true);
      
      // Filter mock suggestions based on search
      const filtered = mockLocationSuggestions.filter(loc =>
        loc.name.toLowerCase().includes(newValue.toLowerCase()) ||
        loc.address.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setShowSavedLocations(true);
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (location) => {
    const fullAddress = `${location.name}, ${location.address}`;
    setSearchValue(fullAddress);
    onChange(fullAddress);
    setShowSavedLocations(false);
    setShowSuggestions(false);
    
    // Store selected location for map display
    const locationData = {
      name: location.name,
      address: location.address,
      fullAddress: fullAddress,
      lat: location.lat,
      lng: location.lng,
    };
    setSelectedLocation(locationData);

    // Update map center if coordinates are available
    if (location.lat && location.lng) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      onLocationChange?.({ address: fullAddress, lat: location.lat, lng: location.lng });
    }
    
    // Update the input field if it exists
    if (inputRef.current) {
      inputRef.current.value = fullAddress;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If there's a search value, create a location from it
      if (searchValue.trim().length > 0) {
        // Check if it matches a saved location
        const matchedSaved = savedLocations.find(loc =>
          loc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        // Check if it matches a suggestion
        const matchedSuggestion = suggestions.find(loc =>
          loc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        const matched = matchedSaved || matchedSuggestion;
        
        if (matched) {
          handleLocationSelect(matched);
        } else {
          // Create location from search value with default coordinates
          const locationData = {
            name: searchValue,
            address: searchValue,
            fullAddress: searchValue,
            lat: defaultCenter.lat,
            lng: defaultCenter.lng,
          };
          setSelectedLocation(locationData);
          setMapCenter(defaultCenter);
          setShowSavedLocations(false);
          setShowSuggestions(false);
        }
      }
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setSearchValue(place.formatted_address);
        onChange(place.formatted_address);
        setShowSavedLocations(false);
        setShowSuggestions(false);
        
        // Extract coordinates from place object
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        
        // Store selected location for map display
        const locationData = {
          name: place.name || place.formatted_address,
          address: place.formatted_address,
          fullAddress: place.formatted_address,
          lat: lat,
          lng: lng,
        };
        setSelectedLocation(locationData);

        // Update map center if coordinates are available
        if (lat && lng) {
          setMapCenter({ lat, lng });
          onLocationChange?.({ address: place.formatted_address, lat, lng });
        }
      } else if (place.name) {
        setSearchValue(place.name);
        onChange(place.name);
        setShowSavedLocations(false);
        setShowSuggestions(false);
        
        // Extract coordinates from place object
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        
        // Store selected location for map display
        const locationData = {
          name: place.name,
          address: place.name,
          fullAddress: place.name,
          lat: lat,
          lng: lng,
        };
        setSelectedLocation(locationData);

        // Update map center if coordinates are available
        if (lat && lng) {
          setMapCenter({ lat, lng });
          onLocationChange?.({ address: place.name, lat, lng });
        }
      }
    }
  };

  // ─── Map picker ("Choose on map") ──────────────────────────────────────
  const openMapPicker = () => {
    const start = (selectedLocation?.lat && selectedLocation?.lng)
      ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
      : mapCenter;
    setPickerCenter(start);
    setPickerAddress('');
    setPickerLoading(true);
    setMapPickerOpen(true);
  };

  const reverseGeocodePickerCenter = (center) => {
    if (!window.google) return;
    if (!geocoderRef.current) geocoderRef.current = new window.google.maps.Geocoder();
    setPickerLoading(true);
    setPickerAddress('');
    geocoderRef.current.geocode({ location: center }, (results, status) => {
      setPickerLoading(false);
      if (status === 'OK' && results?.[0]) {
        setPickerAddress(results[0].formatted_address);
      } else {
        setPickerAddress(`${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
      }
    });
  };

  const handlePickerDragStart = () => setPinDragging(true);

  const handlePickerIdle = () => {
    setPinDragging(false);
    if (!pickerMapRef.current) return;
    const center = pickerMapRef.current.getCenter();
    const next = { lat: center.lat(), lng: center.lng() };
    setPickerCenter(next);
    reverseGeocodePickerCenter(next);
  };

  const handlePickerPlaceChanged = () => {
    if (!pickerAutocompleteRef.current) return;
    const place = pickerAutocompleteRef.current.getPlace();
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (lat && lng) {
      pickerMapRef.current?.panTo({ lat, lng });
    }
  };

  const handleCancelMapPicker = () => setMapPickerOpen(false);

  const handleConfirmMapPicker = () => {
    const finalAddress = pickerAddress || `${pickerCenter.lat.toFixed(4)}, ${pickerCenter.lng.toFixed(4)}`;
    setSearchValue(finalAddress);
    onChange(finalAddress);
    onLocationChange?.({ address: finalAddress, lat: pickerCenter.lat, lng: pickerCenter.lng });
    setSelectedLocation({ name: finalAddress, address: finalAddress, fullAddress: finalAddress, lat: pickerCenter.lat, lng: pickerCenter.lng });
    setMapCenter(pickerCenter);
    setShowSavedLocations(false);
    setShowSuggestions(false);
    setMapPickerOpen(false);
  };

  const handleFocus = () => {
    if (searchValue.trim().length > 0) {
      setShowSuggestions(true);
    }
    setShowSavedLocations(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow click on saved locations
    setTimeout(() => {
      setShowSavedLocations(false);
      setShowSuggestions(false);
    }, 200);
  };

  const filteredLocations = searchValue.trim().length > 0
    ? savedLocations.filter(location =>
        location.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        location.address.toLowerCase().includes(searchValue.toLowerCase())
      )
    : savedLocations;

  const hasFilteredLocations = filteredLocations.length > 0;
  const hasSuggestions = showSuggestions && suggestions.length > 0;

  const renderTextField = (params = {}) => (
    <TextField
      {...params}
      fullWidth
      variant="filled"
      label="Address"
      value={searchValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="Find location or enter address"
      inputRef={inputRef}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
          </InputAdornment>
        ),
      }}
      InputLabelProps={{ shrink: true }}
      sx={formFieldStyles}
    />
  );

  // ─── Map picker overlay ("Choose on map") — reuses this component's own
  // container (the drawer/sidebar it already sits in), not a new overlay type ──
  if (mapPickerOpen) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 520 }}>
        <TextField
          fullWidth
          variant="filled"
          placeholder="Search address"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
              </InputAdornment>
            ),
          }}
          sx={{ ...formFieldStyles, mb: 2 }}
        />
        {isLoaded ? (
          <Autocomplete
            onLoad={(autocomplete) => { pickerAutocompleteRef.current = autocomplete; }}
            onPlaceChanged={handlePickerPlaceChanged}
            options={{ fields: ['geometry'], types: ['establishment', 'geocode'] }}
          >
            <TextField
              fullWidth
              variant="filled"
              placeholder="Search address"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...formFieldStyles, mb: 2 }}
            />
          </Autocomplete>
        ) : (
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search address"
            disabled
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...formFieldStyles, mb: 2 }}
          />
        )}

        <Box sx={{ position: 'relative', flex: 1, minHeight: 420, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={pickerMapContainerStyle}
              center={pickerCenter}
              zoom={15}
              onLoad={(map) => { pickerMapRef.current = map; }}
              onDragStart={handlePickerDragStart}
              onIdle={handlePickerIdle}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                gestureHandling: 'greedy',
                clickableIcons: false,
              }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', bgcolor: 'var(--color-background-tertiary)' }} />
          )}

          {/* Fixed centre pin — a static overlay, never a google.maps.Marker.
              Anchored by its tip: shifted up by its own height so the tip sits on the true centre. */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              pointerEvents: 'none',
              transform: pinDragging ? 'translate(-50%, calc(-100% - 6px))' : 'translate(-50%, -100%)',
              transition: 'transform 150ms ease',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: pinDragging ? -10 : -3,
                left: '50%',
                transform: 'translateX(-50%)',
                width: pinDragging ? 18 : 12,
                height: pinDragging ? 6 : 4,
                borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.35)',
                filter: 'blur(1px)',
                transition: 'all 150ms ease',
              }}
            />
            <LocationOn sx={{ fontSize: 40, color: '#EA4335', display: 'block' }} />
          </Box>
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid var(--color-border-primary)', mt: 2 }}>
          <Typography
            sx={{
              fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {pickerLoading || !pickerAddress ? 'Locating…' : pickerAddress}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: 'var(--color-text-secondary)', mt: 0.25 }}>
            {pickerCenter.lat.toFixed(4)}, {pickerCenter.lng.toFixed(4)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
            <Button
              onClick={handleCancelMapPicker}
              sx={{ color: 'var(--color-primary)', textTransform: 'none', fontSize: '15px', fontWeight: 600, '&:hover': { backgroundColor: 'var(--color-background-secondary)' } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmMapPicker}
              disabled={pickerLoading}
              sx={{
                backgroundColor: 'var(--color-primary)', color: '#fff', textTransform: 'none',
                fontSize: '16px', fontWeight: 600, height: 52, borderRadius: '6px', px: 3,
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
              }}
            >
              Confirm location
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="body2"
        sx={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xs)',
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 'var(--font-weight-regular)',
          marginBottom: '12px',
        }}
      >
        Enter an address location or paste a Google Maps link
      </Typography>

      {/* Address Input with Google Maps Autocomplete */}
      {isLoaded && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE' ? (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChanged}
          options={{
            fields: ['formatted_address', 'name', 'geometry', 'place_id'],
            types: ['establishment', 'geocode'],
          }}
        >
          {renderTextField()}
        </Autocomplete>
      ) : (
        renderTextField()
      )}

      <Button
        onClick={openMapPicker}
        startIcon={<LocationOnOutlined sx={{ fontSize: '18px' }} />}
        sx={{
          mt: 1, color: 'var(--color-primary)', textTransform: 'none', fontSize: '14px', fontWeight: 600,
          padding: 0, minWidth: 0, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        Choose on map
      </Button>

      {/* Saved Locations and Search Suggestions */}
      {showSavedLocations && (hasFilteredLocations || hasSuggestions) && (
        <Box sx={{ marginTop: '16px' }}>
          {/* Saved Locations Section */}
          {hasFilteredLocations && (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '8px',
                }}
              >
                Saved locations
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: hasSuggestions ? '16px' : 0,
                }}
              >
                <List sx={{ padding: 0 }}>
                  {filteredLocations.map((location, index) => (
                    <ListItem
                      key={location.id || `saved-${index}`}
                      button
                      onClick={() => handleLocationSelect(location)}
                      sx={{
                        padding: '12px 16px',
                        borderBottom: index < filteredLocations.length - 1 
                          ? '1px solid var(--color-border-primary)' 
                          : 'none',
                        '&:hover': {
                          backgroundColor: 'var(--color-background-tertiary)',
                        },
                        cursor: 'pointer',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <LocationOnOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={location.name}
                        secondary={location.address}
                        primaryTypographyProps={{
                          sx: {
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontFamily: 'var(--font-family-primary)',
                            fontWeight: 'var(--font-weight-medium)',
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)',
                            fontFamily: 'var(--font-family-primary)',
                            fontWeight: 'var(--font-weight-regular)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </>
          )}

          {/* Search Suggestions Section */}
          {hasSuggestions && (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '8px',
                }}
              >
                Search results
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                <List sx={{ padding: 0 }}>
                  {suggestions.slice(0, 5).map((location, index) => (
                    <ListItem
                      key={`suggestion-${index}`}
                      button
                      onClick={() => handleLocationSelect(location)}
                      sx={{
                        padding: '12px 16px',
                        borderBottom: index < Math.min(suggestions.length, 5) - 1 
                          ? '1px solid var(--color-border-primary)' 
                          : 'none',
                        '&:hover': {
                          backgroundColor: 'var(--color-background-tertiary)',
                        },
                        cursor: 'pointer',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <LocationOnOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={location.name}
                        secondary={location.address}
                        primaryTypographyProps={{
                          sx: {
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            fontFamily: 'var(--font-family-primary)',
                            fontWeight: 'var(--font-weight-medium)',
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)',
                            fontFamily: 'var(--font-family-primary)',
                            fontWeight: 'var(--font-weight-regular)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </>
          )}
        </Box>
      )}

      {/* Google Maps Preview - Shows when location is selected/confirmed */}
      {selectedLocation && !showSavedLocations && (
        <Box sx={{ marginTop: '16px' }}>
          {/* Map Preview */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '140px',
                backgroundColor: 'var(--color-background-tertiary)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {/* Interactive Google Map */}
              {isLoaded && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE' && selectedLocation.lat && selectedLocation.lng ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={15}
                  options={{
                    mapTypeId: 'satellite',
                    disableDefaultUI: true,
                    zoomControl: true,
                    gestureHandling: 'greedy',
                    mapTypeControl: false,
                  }}
                >
                  <Marker
                    position={mapCenter}
                    title={selectedLocation.name}
                  />
                </GoogleMap>
              ) : (
                /* Fallback placeholder */
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'var(--color-background-tertiary)',
                  }}
                >
                  <LocationOnOutlined sx={{ fontSize: '48px', color: 'var(--color-text-secondary)', mb: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    Map preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Location Details */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <LocationOnOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: '20px', mt: '2px' }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '4px',
                }}
              >
                {selectedLocation.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 1.4,
                }}
              >
                {selectedLocation.address}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;
