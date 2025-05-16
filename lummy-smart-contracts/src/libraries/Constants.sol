// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

library Constants {
    // Basis points for percentage calculation (100% = 10000 basis points)
    uint256 constant BASIS_POINTS = 10000;
    
    // Platform fee = 1%
    uint256 constant PLATFORM_FEE_PERCENTAGE = 100;
    
    // QR code validity time window (30 seconds)
    uint256 constant VALIDITY_WINDOW = 30;
    
    // Default maximum markup for resale (20%)
    uint256 constant DEFAULT_MAX_MARKUP_PERCENTAGE = 2000;
}