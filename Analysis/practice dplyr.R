library(tidyverse)
library(nycflights13)

View(flights)


jan1 <- filter(flights, month==1, day==1)
filter(flights, month==11 | month==12)
nov_dec <- filter(flights, month %in% c(11,12))
filter(flights, !(arr_delay > 120 | dep_delay > 120))

is.na(jan1)                   

filter(flights, (arr_delay>120))
filter(flights, dest=="IAH" | dest=='HOU')
filter(flights, (carrier=="UA"|carrier=="AA"|carrier=="DA"))
filter(flights, month %in% c(7,8,9))
filter(flights, arr_delay>120 & dep_delay==0)       
filter(flights, dep_time<600 & dep_time>000)

arrange(flights, dep_time)
arrange(flights, arr_delay)

arrange(flights, desc(dep_delay))
arrange(flights, dep_time)
arrange(flights, air_time)
arrange(flights, desc(distance))
arrange(flights, is.na(air_time))

select(flights, -month)        
select(flights,  starts_with("O"))

rename(flights, dest=destination)
select(flights, time_hour, air_time, everything())

select(flights,dep_delay, arr_time, arr_delay)
select(flights, year, year)

select(flights, contains("time"))

flights_sml <- select( flights,
                       year:day,
                       ends_with("delay"),
                       distance,
                       air_time
                       )
mutate(flights_sml,
       gain= arr_delay- dep_delay,
       speed=distance/air_time *60
       )
transmute(flights,
          gain = arr_delay - dep_delay,
          hours= air_time/60,
          gain_per_hour=  gain/hours
          )
transmute(flights,
          dep_time,
          hour= dep_time%/% 100,
          minute=dep_time%%100
          )
flightsdeptimes <-select(flights,dep_time, sched_dep_time)

flights_time <- select(flights,
                      air_time,
                      arr_time,
                      dep_time)
transmute(flights_time,
       air_time,
       plane_time= arr_time - dep_time)
select(flights, one_of(c("year","month","day")))

