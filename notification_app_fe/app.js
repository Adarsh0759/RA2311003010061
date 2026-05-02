import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Select, MenuItem, FormControl, 
  InputLabel, Card, CardContent, Grid, Button, Tabs, Tab, Box, Pagination 
} from '@mui/material';
import { Log } from 'logging_middleware\logger.js'; 

export default function App() {

  const [tabValue, setTabValue] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [limit, setLimit] = useState(10); // Defaults to top 10 as per rules
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");

  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('readNotifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const fetchNotifications = async () => {
    try {
      let url = `http://20.207.122.201/evaluation-service/notifications?limit=${limit}&page=${page}`;
      if (type) {
        url += `&notification_type=${type}`;
      }

      const response = await fetch(url, {
        headers: { 
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYTA3NTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDQ5NywiaWF0IjoxNzc3Njk5NTk3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGY5OWJlMTktNmJjYy00M2VjLWE1MzktZDkyZTY5ZmU2Mjk1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWRhcnNoIGFuYW5kIiwic3ViIjoiNWFmZjQ1MTYtMWU1OC00NGE1LThiNTQtMDY5NWVkYWIwNjU2In0sImVtYWlsIjoiYWEwNzU5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYWRhcnNoIGFuYW5kIiwicm9sbE5vIjoicmEyMzExMDAzMDEwMDYxIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiNWFmZjQ1MTYtMWU1OC00NGE1LThiNTQtMDY5NWVkYWIwNjU2IiwiY2xpZW50U2VjcmV0IjoiZVNHanZNV0JoZ2Rkak1zVSJ9.4mHq3nKXpMcO90J7D1GBPwNXcSN0qVIhxi9WkHEsDmE" 
        }
      });
      
      const data = await response.json();
      let rawList = data.notifications || [];

      if (tabValue === 1) {
        const weights = { "Placement": 3, "Result": 2, "Event": 1 };
        
        rawList.sort((a, b) => {
          const weightDiff = (weights[b.Type] || 0) - (weights[a.Type] || 0);
          if (weightDiff !== 0) return weightDiff;
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        rawList = rawList.slice(0, 10);
      }

      setNotifications(rawList);

      Log("frontend", "info", "api", `Fetched ${rawList.length} items on tab: ${tabValue === 0 ? 'All' : 'Priority'}`);
    } catch (error) {
      Log("frontend", "error", "api", `API Fetch Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [limit, page, type, tabValue]);

  const markAsRead = (id) => {
    if (!readNotifications.includes(id)) {
      const updated = [...readNotifications, id];
      setReadNotifications(updated);
      try {
        localStorage.setItem('readNotifications', JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage error", e);
      }
      Log("frontend", "info", "state", `Marked as read ID: ${id}`);
    }
  };

  return (
    <Container sx={{ mt: 4, pb: 4 }} maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
        Campus Notifications Platform
      </Typography>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newVal) => {
            setTabValue(newVal);
            setPage(1); // Reset page on tab switch
            Log("frontend", "info", "page", `User navigated to ${newVal === 0 ? "All" : "Priority"} tab`);
          }} 
          centered
        >
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>

      {/* Query Filter Toolbar */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type filter</InputLabel>
            <Select 
              value={type} 
              label="Type filter" 
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Notifications limit</InputLabel>
            <Select 
              value={limit} 
              label="Notifications limit" 
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Items Rendering */}
      <Grid container spacing={2}>
        {notifications.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
              No notifications found matching your search.
            </Typography>
          </Grid>
        ) : (
          notifications.map((item) => {
            const isRead = readNotifications.includes(item.ID);
            return (
              <Grid item xs={12} key={item.ID}>
                <Card 
                  variant="outlined"
                  sx={{ 
                    backgroundColor: isRead ? '#fcfcfc' : '#ffffff', 
                    borderLeft: isRead ? '4px solid #b0bec5' : '4px solid #1976d2',
                    transition: '0.2s',
                    boxShadow: isRead ? 'none' : '0px 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={isRead ? "textSecondary" : "primary"} 
                        fontWeight="bold"
                      >
                        {item.Type} {isRead && "(Read)"}
                      </Typography>
                      <Typography variant="body1" sx={{ my: 0.5 }} fontWeight={isRead ? "normal" : "500"}>
                        {item.Message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(item.Timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    {!isRead && (
                      <Button 
                        variant="contained" 
                        size="small" 
                        color="primary"
                        onClick={() => markAsRead(item.ID)}
                      >
                        Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Pagination Component */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={5} 
          page={page} 
          color="primary" 
          onChange={(e, val) => {
            setPage(val);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Box>
    </Container>
  );
}