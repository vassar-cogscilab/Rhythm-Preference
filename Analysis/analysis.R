library(readr)
library(dplyr)
library(stringr)
library(tidyr)

# Load the data set from the first 200 subjects
all.data <- read_csv2('Data.csv')
all.data$rt <- as.numeric(all.data$rt)



# count the number of unique subjects
n.subjects <- length(unique(all.data$prolific_pid))



# how many subjects are in each of the two conditions?

num_typicality <- select(all.data, trial_type, conditions) %>%
  filter(trial_type == "survey-text" , conditions == "typicality" )

num_preference <- select(all.data, trial_type, conditions) %>%
  filter(trial_type == "survey-text" , conditions == "preference")



# how many times did subjects listen to clips, on average?

avg_listen <- select(all.data, play_history) %>%
  filter(play_history != "NULL") %>%
  
  mutate(
    commacount = str_count(play_history, ",") ,
    playcount = commacount + 1,
    cumsum(playcount)
  ) %>%
  
  count( 
    totalplay = 2631,
    totalppl = 198,
    avgplay = totalplay / totalppl
    ) %>%
  
  select(avgplay)



# Step 1. Get rid of any columns that we don't need for this question. Also get rid of extra rows.      check
# Step 2. Create two new columns, one for music clip # 0, and one for music clip # 1                    check
# Step 3. Create a winner and loser column by using the button press information.                       


main_data <- select(all.data, stimulus, trial_type, button_pressed, conditions)%>%
  
  filter(trial_type == "forced-choice-audio") %>%
  select(stimulus, button_pressed, conditions) %>%
  
  separate(stimulus, c("firstpattern", "secondpattern"), ",") %>%
  
  
  mutate(
    button_pressed == 0,
    
    winners = firstpattern,
    losers = secondpattern
  ) 

 


