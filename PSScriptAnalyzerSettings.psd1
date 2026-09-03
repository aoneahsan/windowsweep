@{
  # Fail CI on anything the analyzer considers an error or warning, with these deliberate exceptions:
  Severity = @('Error', 'Warning')
  ExcludeRules = @(
    # Write-Host is the point: coloured console output that never reaches the pipeline (see lib/ui.ps1).
    'PSAvoidUsingWriteHost',
    # The tool's own --dry-run is the confirmation mechanism; ShouldProcess would duplicate it.
    'PSUseShouldProcessForStateChangingFunctions',
    # Remove-StaleFiles / Remove-StaleUnits name what they do; a singular noun would mislead.
    'PSUseSingularNouns',
    # Positional use of our own helpers (Write-UiLine 'text' 'Color') is deliberate and readable.
    'PSAvoidUsingPositionalParameters'
  )
}
