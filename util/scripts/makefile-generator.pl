#!/usr/local/bin/perl

sub getDependencies($) {
    my $file = $_[0];
    %visited1 = {};
    my $result = getDependenciesRecursive($file, %visited1);
    %visited1 = {};
    return $result;
}

sub getDependenciesRecursive($\%) {
    my ($file, %visited) = @_;
    open my $currFile, "<", "$file" or die ("Couldn't open");
    my @lines = <$currFile>;
    my @nextNeighbours;
    foreach $line (@lines) {
        if ($line =~ /#include "([^"]+)"/) {
            push(@nextNeighbours, $1);
        }
    }
    my @allDependencies;
    push(@allDependencies, "$file");
    foreach $dependency (@nextNeighbours) {
        if ($visited{$dependency} != 1) {
            $visited{$dependency} = 1;
            push(@allDependencies, getDependenciesRecursive($dependency, %visited));
        }
    }
    return join(" ", @allDependencies);
}

open my $makefile, ">", "Makefile" or die("Failed creating file: $!");
print $makefile ("# Makefile generated at ", $datestring, "\n\n");
print $makefile "CC = gcc\n";
print $makefile "CFLAGS = -Wall -g\n\n";

my @files = <*>;
my %dependencies;
my @targets;
# Finding the main target
foreach my $file (@files) {
    next if ($file eq $0 or $file eq "Makefile" or -d $file);
    open my $currFile, "<", "$file" or die ("Failed to open");
    my @lines = <$currFile>;
    foreach my $line (@lines) {
        if ($line =~ /^\s*(int|void)\s*main\s*\(/) {
            $filename = $file;
            $filename =~ s/\.[ch]//g;
            push(@targets, $filename);
            print $makefile "$filename:\t";
            last;
        }
    } 
}

foreach my $file (@files) {
    next if ($file eq $0 or $file eq "Makefile" or -d $file);
    if ($file =~ /\.c$/) {
        $filename = $file;
        $filename =~ s/\.[ch]//g;
        print $makefile "$filename" . ".o ";
    }
}

print $makefile "\n\t";
print $makefile '$(CC) $(CFLAGS) -o $@ ';
foreach my $file (@files) {
    next if ($file eq $0 or $file eq "Makefile" or -d $file);
    if ($file =~ /\.c$/) {
        $filename = $file;
        $filename =~ s/\.[ch]//g;
        print $makefile "$filename" . ".o ";
    }
}
print $makefile "\n\n";

# Printing all the rules
foreach my $file (@files) {
    next if ($file eq $0 or $file eq "Makefile" or -d $file);
    # If the file is a .c file,
    if ($file =~ /\.c$/) {
        $filename = $file;
        $filename =~ s/\.[ch]//g;
        open my $currCFile, "<", "$file" or die("Couldn't open: $!");
        @lines = <$currCFile>;
        my @depends;
        foreach my $line (@lines) {
            if ($line =~ /#include "([^"]+)"/) {
                push(@depends, $1);
            }
        }
        next if (!@depends);
        push(@depends, $file);
        print $makefile ("$filename.o: ", getDependencies($file),  "\n");
    }
}
