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
  mutate(firstpattern=str_extract(firstpattern, "[0-9]+"),
         secondpattern=str_extract(secondpattern, "[0-9]+")) %>%
  mutate(winner = if_else(button_pressed==1, secondpattern, firstpattern),
         loser = if_else(button_pressed==1, firstpattern, secondpattern))

library(EloChoice)

??EloChoice

typicality.data <- main_data %>% filter(conditions=="typicality")
typicality.elo <- elochoice(winner=typicality.data$winner, loser=typicality.data$loser, runs=100)
typicality.ratings <- ratings(typicality.elo)
typicality.ratings.df <- data.frame(stimulus = names(typicality.ratings), typicality.elo = typicality.ratings)

preference.data <- main_data %>% filter(conditions=="preference")
preference.elo <- elochoice(winner=preference.data$winner, loser=preference.data$loser, runs=100)
preference.ratings <- ratings(preference.elo)
preference.ratings.df <- data.frame(stimulus = names(preference.ratings), preference.elo = preference.ratings)

elo.ratings.data <- typicality.ratings.df %>% left_join(preference.ratings.df) %>% arrange(as.numeric(as.character(stimulus)))

## PLOT!

library(ggplot2)

ggplot(data = elo.ratings.data, mapping = aes(x = typicality.elo, y = note.density)) + geom_point() + geom_smooth()

# Get musical patterns loaded

library(jsonlite)

patterns <- read_json("patterns.json", simplifyVector = T)

patterns[1,]

how.many.notes <- function(v){
  return(sum(v != "r"))
}

note.density.result <- apply(patterns, 1, how.many.notes)

elo.ratings.data$note.density <- note.density.result

# some ideas:

# distribution equality (HvsL)
# down-beats vs. off-beats
# pattern change (we created the patterns by copying one measure. how much change is there. look at how measures are same vs. different )

