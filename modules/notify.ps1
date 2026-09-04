# notify.ps1 - --notify: one Windows notification when a run ends.
#
# Off by default. --quiet still notifies (that is the point of the flag when a Scheduled Task runs it).
# Every path is wrapped: a notification that cannot be shown is not a failed run, so this NEVER touches the
# exit code and NEVER writes to stdout - --json promises exactly one line there.

function Get-RunNotificationText {
  <# .SYNOPSIS The two lines a notification carries. Pure, so the self-test can read it without a toast. #>
  $ws = $Script:WS
  $ran = @($ws.Report.steps | Where-Object { $_.status -in 'ran', 'dry-run' }).Count
  if ($ws.DryRun) {
    return [pscustomobject]@{ Title = "$Script:WS_NAME - dry run finished"; Body = ("about " + (Format-Bytes $ws.TotalEstimated) + " could be freed across $ran section(s)") }
  }
  return [pscustomobject]@{ Title = "$Script:WS_NAME finished"; Body = ("freed " + (Format-Bytes $ws.TotalFreed) + " across $ran section(s)") }
}

function Show-ToastNotification {
  <# .SYNOPSIS Windows PowerShell 5.1: a real toast through WinRT, under the PowerShell AppUserModelId. #>
  param([string] $Title, [string] $Body)
  $appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
  $null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
  $null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]
  $tpl = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
  $texts = $tpl.GetElementsByTagName('text')
  $null = $texts.Item(0).AppendChild($tpl.CreateTextNode($Title))
  $null = $texts.Item(1).AppendChild($tpl.CreateTextNode($Body))
  $toast = New-Object Windows.UI.Notifications.ToastNotification($tpl)
  [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
}

function Show-BalloonNotification {
  <# .SYNOPSIS PowerShell 7 has no WinRT projection by default: a tray balloon instead. #>
  param([string] $Title, [string] $Body)
  Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
  Add-Type -AssemblyName System.Drawing -ErrorAction Stop
  $icon = New-Object System.Windows.Forms.NotifyIcon
  try {
    $icon.Icon = [System.Drawing.SystemIcons]::Information
    $icon.Visible = $true
    $icon.ShowBalloonTip(5000, $Title, $Body, [System.Windows.Forms.ToolTipIcon]::Info)
    # The balloon needs the tray icon to survive a moment; without this it is created and destroyed unseen.
    Start-Sleep -Milliseconds 600
  } finally {
    $icon.Visible = $false
    $icon.Dispose()
  }
}

function Send-RunNotification {
  <# .SYNOPSIS --notify: show the end-of-run notification, or say quietly in the log why it could not. #>
  if (-not $Script:WS.Notify) { return }
  $text = Get-RunNotificationText
  try {
    if ($PSVersionTable.PSEdition -eq 'Core') { Show-BalloonNotification -Title $text.Title -Body $text.Body }
    else { Show-ToastNotification -Title $text.Title -Body $text.Body }
    Write-LogLine "notification shown: $($text.Title) - $($text.Body)"
  } catch {
    Write-LogLine "notification could not be shown (this never affects the exit code): $($_.Exception.Message)"
  }
}
