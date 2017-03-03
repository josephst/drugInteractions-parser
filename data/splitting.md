Use csplit (Unix module) to split XML file into smaller pieces, using `<drug ` as a delimiter.

```csplit -n4 "full database.xml" "/<drug /" "{*}"```