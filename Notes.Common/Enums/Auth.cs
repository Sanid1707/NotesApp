namespace Notes.Common.Enums;

public enum ConfirmationStatus : byte
{
    Unconfirmed = 0,
    Confirmed = 1
}

public enum TwoFactorStatus : byte
{
    Disabled = 0,
    Enabled = 1
}