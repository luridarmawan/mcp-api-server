package utils

import (
	"apiserver/internal/config"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims adalah struktur untuk menyimpan data JWT
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// GenerateToken menghasilkan JWT token baru
func GenerateToken(userID uint, username string) (string, error) {
	// Buat claims
	claims := Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token berlaku 24 jam
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	// Buat token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token dengan secret key
	tokenString, err := token.SignedString([]byte(config.Cfg.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken memvalidasi JWT token
func ValidateTokenWithJWT(tokenString string) (*Claims, error) {
	// Parse token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Validasi signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(config.Cfg.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	// Validasi token
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func ValidateToken(tokenString string) (*Claims, error) {

	//TODO: Check Token di databaee auth

	return nil, nil
}
