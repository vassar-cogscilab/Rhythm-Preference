library(readr)
library(dplyr)
library(stringr)

# Load the data set from the first 200 subjects
all.data <- read_csv2('Data.csv')
all.data$rt <- as.numeric(all.data$rt)

# count the number of unique subjects
n.subjects <- length(unique(all.data$prolific_pid))

# how many subjects are in each of the two conditions?

# how many times did subjects listen to clips, on average?

# Step 1. Get rid of any columns that we don't need for this question. Also get rid of extra rows.

main_data <- select(all.data, stimulus, trial_type, button_pressed, conditions) %>%
  filter(trial_type == "forced-choice-audio") %>%
  
  select(stimulus, button_pressed, conditions) %>%
  
  mutate(
    stimulus = str_sub(17,18))
# Step 2. Create two new columns, one for music clip # 0, and one for music clip # 1




# Step 3. Create a winner and loser column by using the button press information.

