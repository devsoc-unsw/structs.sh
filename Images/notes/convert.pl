
opendir(my $dir, ".");
@files = readdir($dir);
foreach $file (@files) {
    $newfilename = $file;
    $newfilename =~ s/Untitled /ref_image_/g;
    system("mv \"$file\" \"$newfilename\"");
} 
