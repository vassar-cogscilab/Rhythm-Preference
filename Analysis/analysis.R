library(readr)
library(dplyr)

# Load the data set from the first 200 subjects
all.data <- read_csv2('Data.csv')

# count the number of unique subjects
n.subjects <- length(unique(all.data$prolific_pid))

# how many subjects are in each of the two conditions?


# how many times did subjects listen to clips, on average?