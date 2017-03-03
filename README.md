# Parse data from DrugBank.ca
See `data/splitting.md` for how to handle the .xml file downloaded.
After splitting, make sure to exclude the `xx0000` file, which just contains header data.

Once split into individual files in `data/split` (or a few files in `data/sample`), run `npm start` to create output files.

# Credits
- Data from DrugBank.ca.
  - Citation: Wishart DS, Knox C, Guo AC, Shrivastava S, Hassanali M, Stothard P, Chang Z, Woolsey J. DrugBank: a comprehensive resource for in silico drug discovery and exploration. Nucleic Acids Res. 2006 Jan 1;34(Database issue):D668-72. 16381955 
- Portions of app use code from [Erick Wendel](https://gallery.technet.microsoft.com/Application-Example-NodeJS-d632ee2d)