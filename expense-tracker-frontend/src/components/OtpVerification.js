import React, { useState } from "react";
import { Paper, Typography, Box, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

function OtpVerification({ onVerified }) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace with your backend endpoint
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      // Example: POST to /api/verify-otp with { otp }
      // const res = await axios.post("http://localhost:5000/api/verify-otp", { otp });
      // if (res.data.success) {
      //   setStatus("success");
      //   onVerified && onVerified();
      // } else {
      //   setStatus("error");
      // }
      // For demo, accept "123456" as valid OTP:
      if (otp === "123456") {
        setStatus("success");
        onVerified && onVerified();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom align="center">
          OTP Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Please enter the 6-digit OTP sent to your email or phone.
        </Typography>
        <form onSubmit={handleVerify}>
          <TextField
            label="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
        {status === "success" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            OTP verified successfully!
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Invalid OTP. Please try again.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default OtpVerification;