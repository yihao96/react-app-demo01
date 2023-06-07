import styled from "@emotion/styled";
import { Badge, BadgeProps } from "@mui/material";
import React from "react";

export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));
