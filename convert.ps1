$file_path = "E:\NAS-01-E\Chernobyl\Chernobyl.mkv"
$subtitle_path = ""
$output_path = "C:\Users\Steve\WebApp\express-video\cdn\videos\AE0WJaEh"
$file = [System.IO.DirectoryInfo]($file_path)
$subtitle = [System.IO.DirectoryInfo]($subtitle_path)
$ffmpeg_path = "C:\Program Files\FFmpeg\bin\"
$bento4_path = "C:\Python27\Tools\Bento4-SDK\bin\"

cd $ffmpeg_path
$qualities = @("1280:720", "640:360")
for ($i = 0; $i -lt $qualities.length; $i++) {
  $params = [System.Collections.ArrayList]@()
  $params.Add("-i")
  $params.Add($file)

  if (!($file.Extension -eq '.mp4')) {
    $params.Add("-c:v")
    $params.Add("libx264")
    $params.Add("-c:a")
    $params.Add("aac")
    $params.Add("-b:a")
    $params.Add("192k")
  } else {
    $params.Add("-c:a")
    $params.Add("copy")
    $params.Add("-b:a")
    $params.Add("192k")
  }
  $params.Add("-ac")
  $params.Add("2")

  $params.Add("-preset")
  $params.Add("slower")

  $params.Add("-r")
  $params.Add("24")
  $params.Add("-vsync")
  $params.Add("1")

  $params.Add("-vf")
  $scale = "scale=" + $qualities[$i]
  if ($subtitle.Extension -eq '.srt') {
    Copy-Item $subtitle -Destination ".\"
    $srt = "subtitles=" + $subtitle.Name + "," + $scale
    $params.Add($srt)
  } elseif ($subtitle.Extension -eq '.ass') {
    Copy-Item $subtitle -Destination ".\"
    $ass = "subtitles=" + $subtitle.Name + "," + $scale
    $params.Add($ass)
  } else {
    $params.Add($scale)
  }

  $params.Add("-force_key_frames")
  $params.Add("expr:eq(mod(n,24),0)")
  $params.Add("-x264-params")
  $params.Add("keyint=24:min-keyint=12")

  $output = "output-" + $i + ".mp4"
  .\ffmpeg @params $output

  Move-Item $output -Destination $bento4_path
  Write-Host @params
}
Remove-Item * -Include *.srt
Remove-Item * -Include *.ass
cd $bento4_path
Remove-Item -Path $output_path -Force -Recurse -ErrorAction SilentlyContinue
.\mp4fragment --fragment-duration 2000 "output-0.mp4" "output-0-frgmnt.mp4"
.\mp4fragment --fragment-duration 2000 "output-1.mp4" "output-1-frgmnt.mp4"
.\mp4dash "output-0-frgmnt.mp4" "output-1-frgmnt.mp4" -o $output_path
Remove-Item * -Include *.mp4