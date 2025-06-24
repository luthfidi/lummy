// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

library Constants {
    // Basis point untuk perhitungan persentase (100% = 10000 basis poin)
    uint256 constant BASIS_POINTS = 10000;
    
    // Platform fee = 1%
    uint256 constant PLATFORM_FEE_PERCENTAGE = 100;
    
    // Jendela waktu validitas QR code (30 detik)
    uint256 constant VALIDITY_WINDOW = 30;
    
    // Default maksimum markup untuk resale (20%)
    uint256 constant DEFAULT_MAX_MARKUP_PERCENTAGE = 2000;
}