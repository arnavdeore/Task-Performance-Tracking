// Slate thought-of-the-moment library (tested in the design phase).
// Usage: const lib = createThoughtLib(); lib.thoughtAt(Date.now()); lib.panchang(Date.now());
export function createThoughtLib() {
  const APPS = [
    "Carry this into your next dashboard.",
    "Let it guide the next dataset you clean.",
    "Try it on the task you have been postponing.",
    "Bring it to your end-of-day update tonight.",
    "Let it shape how you set your next deadline.",
    "Apply it to one stubborn query today.",
    "Share it with a teammate who could use it.",
    "Take one slow breath, then pick up your first task.",
    "Remember it when a deadline feels heavy.",
    "Use it to choose today’s one priority.",
    "Keep it close when the data refuses to behave.",
    "Let it soften your next difficult conversation.",
    "Start with ten focused minutes.",
    "Let it steady you before a review or a demo.",
    "Hold it lightly, and begin.",
    "Make it the theme of your next break.",
    "Say it once, softly, and start again.",
    "Let it remind you why this work matters.",
    "Let it help you close the day with a clear mind.",
    "Read it twice, then get back to the screen.",
    "Let it guide how you name and organise things today.",
    "Use it when you plan tomorrow’s list.",
    "Let it lighten the next small task.",
    "Notice where it already shows up in your week."
  ];
  
  const HINDU = [
    "Yogah karmasu kaushalam: skill in action is itself yoga. Be fully where your hands are.",
    "You hold the right to the work, never to its fruits. Pour yourself into the effort and let the result arrive in its own time.",
    "A steady mind is not one that feels nothing, but one that returns to centre after every wave.",
    "Santosham param sukham: contentment is the highest happiness. Enough is also a place to rest.",
    "Udyamena hi siddhyanti karyani, na manorathaih: tasks are finished by effort, not by wishing.",
    "Tamaso ma jyotirgamaya: lead me from darkness toward light. Begin with the next small clarity.",
    "Satyameva jayate: truth alone prevails. Honest numbers and honest effort make the strongest foundation.",
    "Vasudhaiva kutumbakam: the world is one family. Work kindly; someone downstream depends on you.",
    "Atmanam viddhi: know yourself. Notice what energises you today, and do that first.",
    "Aim like the archer: still body, steady breath, clear target, then release without anxiety.",
    "Patience is a form of tapas. Staying with a hard task a little longer is a quiet austerity that builds strength.",
    "Kshama, forgiveness, begins at home. A missed deadline is a lesson, not a verdict.",
    "Ahimsa starts in thought. Speak to yourself as gently as you would to a friend.",
    "Seva turns work into worship. Ask who will be helped by what you finish today.",
    "Like the lotus, rise from the mud and remain unstained. Difficulty need not define your day.",
    "Dhairya, courage, is walking forward while afraid. Take the first step and the path clarifies.",
    "Abhyasa and vairagya, steady practice and gentle detachment, are the two wings of a calm mind.",
    "A lamp does not choose which room to light; it simply shines. Be useful where you are.",
    "The sun rises without announcement and without fail. Consistency is its own kind of greatness.",
    "Shraddha, faith in the process, makes a long task lighter to carry.",
    "A river stays deep when it flows within its banks. Not every desire needs your attention today.",
    "Kala, time, devours hesitation. Start small, and start now.",
    "Anasakti, working without clinging, frees you to enjoy the work itself.",
    "Tapas is a fire that purifies. Small daily efforts burn away the dross of doubt.",
    "Vinaya, humility, keeps the learner’s door open. Ask the question, and be glad of the answer.",
    "Where there is dharma there is steadiness. Do what is right, and the rest follows its course.",
    "A long breath makes a long view. Breathe before you begin.",
    "Sankalpa, a clear intention, is the seed. Name the one thing that matters today.",
    "Daya, compassion, makes strength gentle. Strong people and strong teams carry it.",
    "Set down yesterday’s weight. The mind carries only what you refuse to release.",
    "Mitrata: a good friend is a field of ease. Reach out to someone whose company steadies you.",
    "Even a thousand-mile road is made of single steps, and fortune favours the one who keeps walking.",
    "The pot fills drop by drop. Do not despise small, steady progress.",
    "Anger is smoke that hides the path. Wait for it to clear before you decide.",
    "Vidya, learning, is wealth no one can take, and the more you share it the more it grows.",
    "Aham brahmasmi: the same light lives in you. Speak and act from that quiet centre.",
    "Tat tvam asi: you are that. Trust the capability that is already within you.",
    "Charaiveti, charaiveti: keep moving, keep moving. The traveller who walks never grows stale.",
    "Shanti is not the absence of work but the presence of balance within it.",
    "As the swan sifts milk from water, separate what truly matters from the noise.",
    "Nishkama karma, action without craving, is the secret of working hard and sleeping well.",
    "The mind is restless, yes, but practice tames it, the way a gardener guides a wild vine.",
    "Gratitude is the shortest prayer. Name three things that went right this week.",
    "Rest is part of dharma. The field lies fallow so the harvest can be rich.",
    "Be like the earth: patient, supporting everything, asking nothing, and still producing abundance.",
    "Sthitaprajna, the one of steady wisdom, meets praise and blame with the same calm face.",
    "The one who conquers the mind has a friend for life; the one who does not has a constant critic. Make peace with your thoughts.",
    "Sheela, good character, is the quiet interest on every honest day’s work.",
    "Mauna, a little silence, lets the answer you already carry become audible."
  ];
  
  const NATURE = [
    "The river does not argue with the stone. It keeps flowing, and the stone yields.",
    "A seed does not rush the sun. It grows in the dark first.",
    "The banyan shelters thousands because it let its roots go deep before its branches spread.",
    "The monsoon arrives late some years, and still the fields turn green. Trust the season you are in.",
    "A diya is small, yet the whole room changes when it is lit.",
    "The Ganga carries everything and remains the Ganga. Let the day pass through you without sticking.",
    "A peacock’s feathers took a whole season to grow. Beautiful work is rarely quick.",
    "The mountain is only many small stones that stayed. Stay with your task.",
    "The tulsi plant is tended daily, not once. Care is a habit, not an event.",
    "A bamboo bends in the storm and stands afterwards. Flexibility is strength.",
    "The moon is never in a hurry, yet it completes its whole circle each month.",
    "Dawn does not need your permission. Step into the new light and begin.",
    "A potter’s wheel keeps turning and the clay slowly finds its shape. Keep turning.",
    "The honeybee visits thousands of flowers for one spoon of honey. Quiet persistence tastes sweet.",
    "Even the tallest mango tree began as a stone that someone planted and watered.",
    "The conch gives its sound only when breath passes through it. Let your effort carry your voice.",
    "Rain falls on every roof. Use what arrives and make it useful.",
    "A boat is safe in harbour, yet it was built to sail. Try the thing that stretches you.",
    "The sunflower follows the light. Turn toward what nourishes your focus.",
    "Cool shade is the gift of a tree that endured many summers.",
    "Clouds pass and the sky stays. Your calm is the sky, not the weather.",
    "The oil lamp burns steadily when sheltered from the wind. Protect your attention.",
    "A single thread is weak, but woven together it makes a sari that lasts. Habits weave results.",
    "The lotus opens only when the sun is high. Some things cannot be forced, only prepared for.",
    "The wind cannot carry a hill, but it can shape it over years. Gentle effort is not wasted.",
    "The cuckoo sings after a long winter without apology. Your season will come.",
    "A pearl is an oyster’s answer to irritation. Some of your best work may grow from a nuisance.",
    "Water takes the shape of any pot and still remains water. Adapt without losing yourself.",
    "The sea does not count its waves. Do not count every small setback.",
    "A kite rises against the wind, not with it. Resistance can lift you.",
    "The roots of an old peepal tree split stone slowly. Patience can break walls.",
    "Morning dew does not fall in a storm; it settles quietly. Quiet work still nourishes.",
    "The temple bell rings clear because it was struck with intent. Make your effort deliberate.",
    "Embers that are kept covered stay alive through the night. Protect your energy.",
    "A rangoli is made grain by grain, then admired as a whole. So is a finished project.",
    "The swallow builds its nest with mud, one beakful at a time. Progress is built the same way.",
    "Fog lifts without being asked to. A confusing task often clears if you keep walking.",
    "A well is dug before the thirst arrives. Prepare a little today for tomorrow.",
    "The koel does not compete with the crow; each has its own song. Run your own race.",
    "The mountain stream finds a path around every rock. Look for another route.",
    "The farmer sows without knowing which seed will sprout, and still sows. Plant generously.",
    "Autumn leaves fall so the tree can rest and bud again. Letting go is part of growth.",
    "The jasmine perfumes the whole evening yet asks nothing. Do good work quietly.",
    "A candle loses nothing by lighting another. Share what you know.",
    "The sunrise paints the same sky differently each day. Same routine, fresh eyes.",
    "A lake is clear when it is still. Give your mind a minute to settle.",
    "The first rain on dry earth smells like hope. Begin, even if conditions are not perfect.",
    "A tortoise carries its home and still reaches the water. Steady beats swift.",
    "The ocean is made of drops, and no drop is insignificant.",
    "The earthen lamp turns clay into light. Ordinary materials can make something that glows."
  ];
  
  const GLOBAL = [
    ["A journey of a thousand miles begins beneath your feet. Take the step in front of you.", "Chinese proverb"],
    ["The best time to plant a tree was twenty years ago. The second best time is now.", "Proverb"],
    ["Fall seven times, stand up eight.", "Japanese proverb"],
    ["It does not matter how slowly you go as long as you do not stop.", "Confucian thought"],
    ["What you can control is your effort and your response. Start there.", "Stoic idea"],
    ["Begin anywhere. A rough start is better than a perfect plan that never leaves the page.", "Global wisdom"],
    ["Done is a gentle teacher. Ship the draft, then learn from it.", "Global wisdom"],
    ["Small wins stack like bricks. Lay one today.", "Global wisdom"],
    ["Hard roads often lead to beautiful destinations.", "Global wisdom"],
    ["The obstacle on the path becomes the path.", "Stoic idea"],
    ["If you want to go fast, go alone. If you want to go far, go together.", "African proverb"],
    ["Smooth seas never made a skilful sailor.", "Proverb"],
    ["You do not need to see the whole staircase. Just take the first step.", "Global wisdom"],
    ["Every expert was once a beginner who refused to quit.", "Global wisdom"],
    ["Progress, not perfection, is the honest goal of any day.", "Global wisdom"],
    ["Be a student of your own work: notice, adjust, repeat.", "Global wisdom"],
    ["Kind words cost nothing and are remembered for years.", "Global wisdom"],
    ["Your future self is quietly grateful for what you finish today.", "Global wisdom"],
    ["Courage is not the absence of fear but the decision that something else matters more.", "Global wisdom"],
    ["Discipline is choosing between what you want now and what you want most.", "Global wisdom"],
    ["A calm mind solves what a rushed one only rearranges.", "Global wisdom"],
    ["You are allowed to be a work in progress and a masterpiece at the same time.", "Global wisdom"],
    ["The harder you work for something, the greater you will feel when you achieve it.", "Global wisdom"],
    ["When the day is heavy, make the list shorter, not yourself smaller.", "Global wisdom"],
    ["Rest is not a reward for finishing. It is part of how things get finished.", "Global wisdom"],
    ["Where attention goes, energy flows. Choose where to point it.", "Global wisdom"],
    ["Mistakes are proof that you are trying something.", "Global wisdom"],
    ["Dig the well before you are thirsty.", "Chinese proverb"],
    ["Even a clock that has stopped is right twice a day, so keep asking better questions.", "Proverb"],
    ["He who asks a question is a fool for five minutes; he who never asks remains a fool forever.", "Chinese proverb"],
    ["Tomorrow is built from what you do in the next hour.", "Global wisdom"],
    ["A smooth process is born from many rough drafts.", "Global wisdom"],
    ["Gratitude turns what we have into enough.", "Global wisdom"],
    ["You cannot pour from an empty cup. Fill yours first, then serve.", "Proverb"],
    ["Slow is smooth, and smooth becomes fast.", "Global wisdom"],
    ["Doubt kills more dreams than failure ever will, so act while uncertain.", "Global wisdom"],
    ["Many hands make light work; ask for one.", "Proverb"],
    ["The man who moves a mountain begins by carrying away small stones.", "Chinese proverb"],
    ["A smooth path rarely teaches. Respect the bumps.", "Global wisdom"],
    ["Quality is remembered long after the deadline is forgotten.", "Global wisdom"],
    ["Plan the work, then work the plan, and forgive yourself the gaps.", "Global wisdom"],
    ["Where there is a will, there is usually a spreadsheet and a calendar.", "Global wisdom"],
    ["A little progress each day adds up to big results.", "Global wisdom"],
    ["Be patient with yourself; nothing in nature blooms all year.", "Global wisdom"],
    ["If you cannot do great things, do small things in a great way.", "Global wisdom"],
    ["Do what you can, with what you have, where you are.", "Proverb"],
    ["The only way to eat an elephant is one bite at a time.", "Proverb"],
    ["Clear is kind. Say what you mean, simply.", "Global wisdom"],
    ["A good decision today beats a perfect decision next week.", "Global wisdom"],
    ["Make it work, make it right, make it fast, in that order.", "Engineer’s maxim"],
    ["Measure twice, cut once.", "Craftsman’s proverb"],
    ["Clean data today saves a thousand arguments tomorrow.", "Analyst’s maxim"],
    ["A chart is a sentence; make sure it says one clear thing.", "Analyst’s maxim"],
    ["Curiosity is the engine of good analysis. Ask one more why.", "Analyst’s maxim"],
    ["Trust the data, but check the source.", "Analyst’s maxim"],
    ["A good dashboard answers the question before it is asked.", "Analyst’s maxim"],
    ["Every messy dataset is just a story waiting for an editor.", "Analyst’s maxim"],
    ["Naming things well is half of understanding them.", "Developer’s maxim"],
    ["Write code, and notes, for the person you will be next month.", "Developer’s maxim"],
    ["Simple is hard to build and easy to love.", "Developer’s maxim"],
    ["Debugging is detective work: stay curious, not frustrated.", "Developer’s maxim"],
    ["Let your results speak, and let your kindness speak louder.", "Global wisdom"],
    ["Energy is a finite gift; spend it on what matters.", "Global wisdom"],
    ["Your pace is your pace. Comparison is a thief of progress.", "Global wisdom"],
    ["Growth lives just outside your comfort zone, near a door marked try.", "Global wisdom"],
    ["Hope is a verb: it shows up as the next action.", "Global wisdom"],
    ["Good things take time; great things take consistency.", "Global wisdom"],
    ["Optimism is a skill. Practise it on small things first.", "Global wisdom"],
    ["Today’s effort is tomorrow’s ease.", "Global wisdom"],
    ["Do not wait for confidence. Action builds it.", "Global wisdom"],
    ["Don’t count the days; make the days count.", "Global wisdom"],
    ["One focused hour beats three distracted ones.", "Global wisdom"],
    ["Some days you lead, some days you learn; both are progress.", "Global wisdom"],
    ["Where you are is a starting point, not a verdict.", "Global wisdom"],
    ["Tidy your desk and your mind will follow, a little.", "Global wisdom"],
    ["The magic of a plan is that it lets your mind rest.", "Global wisdom"],
    ["Appreciate the quiet work nobody applauds; it holds everything up.", "Global wisdom"],
    ["A smile is a small, free upgrade for the whole room.", "Global wisdom"],
    ["Ask for help early; it is cheaper than asking late.", "Global wisdom"],
    ["Start with the end in mind, then take the first small step toward it.", "Global wisdom"],
    ["You are closer to finishing than you feel.", "Global wisdom"],
    ["Make peace with imperfect and ship it with care.", "Global wisdom"],
    ["Wise people learn from everyone and compare to no one.", "Global wisdom"],
    ["Kindness to yourself is not laziness; it is maintenance.", "Global wisdom"],
    ["Breathe in clarity, breathe out clutter.", "Global wisdom"],
    ["Work hard in silence and let your results be the noise.", "Global wisdom"],
    ["Every day offers a clean page. Write something you are proud of.", "Global wisdom"],
    ["A positive mind sees the same problem and finds a different door.", "Global wisdom"],
    ["Failure is data. Collect it, analyse it, and improve the model.", "Analyst’s maxim"],
    ["If the plan does not work, change the plan, not the goal.", "Proverb"],
    ["A diamond is just a lump of coal that handled pressure well.", "Proverb"],
    ["Trees that are slow to grow bear the best fruit.", "Proverb"],
    ["Patience is bitter, but its fruit is sweet.", "Proverb"],
    ["After the rain, the earth smells of possibility.", "Global wisdom"],
    ["Little by little, a little becomes a lot.", "Tanzanian proverb"],
    ["Where there is love there is life; bring care to your craft.", "Global wisdom"],
    ["The lamp that lights others lights itself.", "Global wisdom"],
    ["What you practise grows stronger. Practise calm.", "Global wisdom"],
    ["Cherish ordinary moments; later you will know they were the big ones.", "Global wisdom"],
    ["The word impossible often just means not yet.", "Global wisdom"],
    ["Done with care is worth more than done with haste.", "Global wisdom"],
    ["Focus is saying no to ninety good ideas so the one great one can happen.", "Global wisdom"],
    ["There is always a way if you are willing to look sideways.", "Global wisdom"],
    ["Each ending is a chance to tidy up before the next beginning.", "Global wisdom"],
    ["Be the colleague whose calm is contagious.", "Global wisdom"],
    ["Your work is a way of caring for people you may never meet.", "Global wisdom"],
    ["Take pride in the steady and the reliable; they are rarer than flash.", "Global wisdom"],
    ["Celebrate every step: acknowledgement is fuel.", "Global wisdom"]
  ];
  
  const TITHI_NAMES = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi"];
  const MONTHS = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
  const VARA = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];
  const PHASES = ["Brahma Muhurta", "Pratah", "Madhyahna", "Aparahna", "Sandhya", "Ratri"];
  
  const TITHI_TEXT = {
    1: ["Pratipada is the doorway of the fortnight. Begin something small and honest today.", "A new tithi cycle opens: set the tone for the next two weeks with one clear intention."],
    2: ["Dwitiya asks for companionship. Seek one useful conversation today.", "Two is the number of balance; weigh effort against rest."],
    3: ["Tritiya favours steady creation. Build a little, not a lot, and finish it.", "Three small tasks done well make a good day."],
    4: ["Chaturthi belongs to Ganesha, remover of obstacles. Name the one block in your way and take a step toward it.", "On Chaturthi, begin with a prayer or a pause, then clear the first hurdle."],
    5: ["Panchami honours learning. Spend a few minutes growing a skill today.", "Five senses, one focus: give your task your full attention."],
    6: ["Shashthi encourages discipline and care. Do the unglamorous part first.", "Look after your routines; they look after you."],
    7: ["Saptami is a day of light and energy. Let your best hour go to your hardest task.", "Seven colours make the rainbow; bring variety and joy to your work."],
    8: ["Ashtami is the day of strength. Be firm where it matters and gentle everywhere else.", "Shakti rises on Ashtami: trust your inner power to take on the difficult part."],
    9: ["Navami celebrates completion and courage. Finish what you started.", "Nine is the number of fulfilment; bring one loose end to a close."],
    10: ["Dashami is a day of victory over small doubts. Take the decision you have been postponing.", "Ten fingers, countless skills: use your hands to start the work."],
    11: ["Ekadashi is a day to simplify. Eat light, think light, and keep your tasks few and clear.", "Ekadashi favours restraint and reflection. Do less, but do it with presence."],
    12: ["Dwadashi invites gratitude. Thank someone who helped you recently.", "After the quiet of Ekadashi, Dwadashi asks you to act with a clearer mind."],
    13: ["Trayodashi evening is Pradosh, a time sacred to Shiva. Make the closing hours of the day calm and kind.", "Trayodashi reminds you that endings can be peaceful. Wrap up with grace."],
    14: ["Chaturdashi asks you to clear what is stale. Tidy a folder, a list, or a worry.", "Let go of one thing today that no longer serves your work."],
    15: ["Purnima is fullness. Look at what you have completed this fortnight and let it shine.", "The full moon rewards reflection. Appreciate how far you have come."],
    30: ["Amavasya is the dark of the moon, a time for rest and inner work. Slow down, and plan with quiet clarity.", "On Amavasya, honour the ancestors and your own roots, then begin again tomorrow in new light."]
  };
  
  const PAKSHA_TEXT = {
    Shukla: [
      "The moon is waxing: a good fortnight to build, begin and grow.",
      "Shukla Paksha, the bright half, favours new efforts. Let your plans gain light day by day.",
      "As the moon grows, let your focus grow with it, a little more each day.",
      "In the bright fortnight, small steady additions become something full by the end."
    ],
    Krishna: [
      "The moon is waning: a good fortnight to refine, finish and let go.",
      "Krishna Paksha, the dark half, favours review and completion. Close open loops.",
      "As the moon recedes, simplify; remove the extra to see the essential.",
      "In the dark fortnight, polish what you have built and release what you do not need."
    ]
  };
  
  const VARA_TEXT = [
    ["Sunday is Ravivara, the day of Surya, giver of light and vitality. Rest, recharge and soak up a little sunshine.", "Surya rises every day without fail. Plan a gentle week ahead in his steady light.", "On Ravivara, tend to the body and spirit that carry your work."],
    ["Monday is Somavara, the day of Shiva and the Moon. Start the week calm, clear and centred.", "Somavara favours steadiness over speed. Pick the week’s one theme and begin.", "A calm Monday sets the tone for the whole week. Breathe, then start."],
    ["Tuesday is Mangalavara, the day of Hanuman and Mangala. Bring courage and energy to the hardest task.", "Mangalavara rewards action. Do the thing you have been delaying.", "Hanuman leapt across the ocean one confident decision at a time. Decide, then leap."],
    ["Wednesday is Budhavara, ruled by Budha, the planet of intellect and speech. Think clearly, write clearly, ask clearly.", "Budhavara is a good day for analysis and communication. Share a clear update.", "Ganesha, patron of wisdom, is often honoured on Wednesday. Remove one obstacle."],
    ["Thursday is Guruvara, the day of Brihaspati and the teacher. Learn something and share something.", "Guruvara honours wisdom. Review what you know, and refine your approach.", "A guru lights a lamp rather than carrying you. Pick up one lesson today."],
    ["Friday is Shukravara, the day of Lakshmi and Shukra. Appreciate what you have built this week.", "Shukravara favours beauty and order. Tidy the work you will hand over.", "Lakshmi favours the diligent and the grateful. Finish the week with both."],
    ["Saturday is Shanivara, the day of Shani, teacher of discipline. Slow, steady effort pays off.", "Shani rewards patience and honesty. Do the right thing quietly.", "Shanivara asks you to take responsibility and finish what you promised."]
  ];
  
  const PHASE_TEXT = [
    ["Brahma Muhurta, the hour before dawn, is the stillest time of the day. Whatever you plant now grows quietly.", "In the pre-dawn hour the mind is clear. Take one slow breath and set your intention.", "Brahma Muhurta is a gift: a quiet mind before the world wakes."],
    ["Pratah, the morning, is for your most important work. Start with the hardest thing while energy is fresh.", "Morning light is a fresh page. Write the first line of your day with care.", "A good morning is built from one small task finished early.", "Pratah favours focus. Silence a notification and begin."],
    ["Madhyahna, midday, is the sun at full strength. Keep going, steadily, then eat and rest well.", "At noon, pause for water and a breath before the afternoon.", "Midday is a good moment to check your progress and adjust your plan."],
    ["Aparahna, the afternoon, is for steady work and collaboration. Keep going; the finish is closer than it feels.", "When energy dips mid-afternoon, a short walk and a glass of water beat another coffee.", "Afternoon is for tidy-up work: reply, review, refine."],
    ["Sandhya, twilight, is a threshold between work and rest. Take a breath and let the day soften.", "Evening is a good time for reflection. What went well today?", "As the light fades, write down tomorrow’s first task so your mind can relax."],
    ["Ratri, the night, is for rest. Whatever is unfinished will still be there, and you will meet it better rested.", "The night is a pause, not a failure. Sleep is also productive.", "Close the screen, take a slow breath, and let tonight’s rest do its quiet work."]
  ];
  
  const FESTIVAL_TEXT = {
    "2026-10-10": ["Mahalaya Amavasya: a day to remember those who came before and to begin the festive season with gratitude.", "At Mahalaya the goddess is invoked and the old makes way for the new. Tidy something old, and welcome something fresh.", "Honour your roots today; they hold you steady as you grow."],
    "2026-10-20": ["Vijayadashami: the triumph of good over difficulty. Today, take one brave decision.", "Dussehra reminds us that every Ravana, every big problem, falls to patience, courage and right action.", "On Vijayadashami, finish something you have been carrying, and celebrate the win."],
    "2026-10-22": ["Papankusha Ekadashi: a day to restrain the restless mind. Keep today light and focused.", "Papankusha means the goad that checks the elephant of wandering thoughts. Gently guide your attention back.", "Eat light, think clear, and let simplicity be your strength today."],
    "2026-10-25": ["Sharad Purnima: the brightest moon of the year. Let a little of that light settle into your thinking.", "Under the autumn full moon, rest in what is complete and enough.", "Sharad Purnima celebrates abundance. Notice what has gone well this season."],
    "2026-10-29": ["Karwa Chauth: a day of devotion and patience. Honour the people whose steady love holds your world together.", "Karwa Chauth is faith held through a long day. Hold yours with patience too.", "Moonrise rewards the one who waited. Good things come to those who keep their promise."],
    "2026-11-06": ["Dhanteras: the festival of well-being and wealth. Invest a little today in your health, skills or savings.", "Dhanteras reminds us that health is the first wealth. Take care of your body today.", "Begin Diwali week by tidying your space and your plans, and welcome prosperity in."],
    "2026-11-07": ["Choti Diwali approaches: clean what is cluttered, inside and out, before the lights are lit.", "A tidy desk and a tidy mind welcome the festival of lights.", "Let go of one small worry today as you prepare your lamps."],
    "2026-11-08": ["Happy Diwali! Light a lamp, and let it remind you that a small flame can dispel a great darkness.", "Deepavali celebrates the return of light. May your work and your home shine today.", "On this day of lights, thank the people who made your year brighter.", "Diwali asks us to light one more lamp than we think we need. Be generous with your warmth."],
    "2026-11-11": ["Bhai Dooj celebrates the bond between siblings. Call someone you care about.", "Bhai Dooj reminds us that love is a daily practice. Send a kind message today.", "Honour the people who have quietly looked out for you."],
    "2026-11-15": ["Chhath Puja honours Surya and the discipline of the early riser. Offer thanks for the energy that gets things done.", "Chhath is devotion made visible through patience. Practise yours in your work today.", "Gratitude to the sun, the giver of life, is the purest form of thanks. Look up for a moment."],
    "2026-11-21": ["Tulsi Vivah marks the sacred union of Tulsi and Vishnu. Care for something living today.", "Tulsi is tended with daily love. Show the same care to a long-running project.", "The sacred and the everyday meet at the tulsi plant. Find a small sacred moment in your day."],
    "2026-11-24": ["Dev Diwali, the festival of lights of the gods. Let your work shine a little too.", "Dev Diwali lights up the riverbanks. Be a lamp for one person today.", "Light is shared, not spent. Pass your lamp to someone else."],
    "2026-12-04": ["Utpanna Ekadashi: the beginning of the Ekadashi vows. Start a small good habit today.", "Utpanna Ekadashi celebrates the birth of a source of strength. Remember where yours comes from.", "Simplify today; clarity is the best offering."],
    "2026-12-20": ["Gita Jayanti: the day the Gita’s teaching on duty and equanimity is remembered. Do your work with a steady heart.", "On Gita Jayanti, remember: you hold the right to action, not to its fruits. Act fully, and release the outcome.", "Mokshada Ekadashi and Gita Jayanti together: a day to find freedom in clear, honest action."],
    "2026-12-23": ["Margashirsha Purnima: the full moon of a month dear to Krishna. Celebrate what has been completed.", "Under the winter full moon, rest in the fullness of the year so far.", "Purnima is a time for gratitude. Name three things that went well this month."],
    "01-14": ["Makar Sankranti: the sun turns northward and days grow longer. A fresh beginning is in the air.", "Sankranti celebrates change and harvest. Reap something you have worked on.", "As the sun turns, turn your attention too, toward what is growing."],
    "04-14": ["Baisakhi and the solar new year in many parts of India: a day to celebrate harvest and a fresh start.", "New year in the sun’s calendar: set one intention for the months ahead.", "Baisakhi is about gratitude for the fields you have tended. Look at your own."]
  };
  
  const NAVRATRI_TEXT = [
    "Navratri celebrates Shakti, the force that gets things done. Draw on your own strength today.",
    "Nine nights, nine forms of the goddess: each asks you to bring a different quality to your day.",
    "In Navratri the focus is inward discipline. Keep your routines steady and your mind kind.",
    "Navratri lights up the evenings. Finish your day with something joyful."
  ];
  
  function hash32(str) {
    let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0) * 4294967296 + (h1 >>> 0);
  }
  function rnd(key) {
    let a = hash32(key) >>> 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  
  const R = Math.PI / 180;
  const norm = (x) => ((x % 360) + 360) % 360;
  function astro(ms) {
    const d = ms / 86400000 + 2440587.5 - 2451545.0;
    const g = norm(357.528 + 0.9856003 * d);
    const sun = norm(280.460 + 0.9856474 * d + 1.915 * Math.sin(g * R) + 0.020 * Math.sin(2 * g * R));
    const L = 218.316 + 13.176396 * d, M = norm(134.963 + 13.064993 * d), D = norm(297.850 + 12.190749 * d), F = norm(93.272 + 13.229350 * d);
    const moon = norm(L + 6.289 * Math.sin(M * R) + 1.274 * Math.sin((2 * D - M) * R) + 0.658 * Math.sin(2 * D * R) + 0.214 * Math.sin(2 * M * R) - 0.186 * Math.sin(g * R) - 0.114 * Math.sin(2 * F * R) + 0.059 * Math.sin((2 * D - 2 * M) * R) + 0.057 * Math.sin((2 * D - M - g) * R) + 0.053 * Math.sin((2 * D + M) * R) + 0.046 * Math.sin((2 * D - g) * R) + 0.041 * Math.sin((M - g) * R));
    return { sun, moon };
  }
  function elongation(ms) { const a = astro(ms); return norm(a.moon - a.sun); }
  
  function panchang(ms) {
    const dt = new Date(ms);
    const e = elongation(ms);
    const idx = Math.floor(e / 12);
    const paksha = idx < 15 ? "Shukla" : "Krishna";
    const num = (idx % 15) + 1;
    const tithiName = num === 15 ? (paksha === "Shukla" ? "Purnima" : "Amavasya") : TITHI_NAMES[num - 1];
    const tkey = num === 15 && paksha === "Krishna" ? 30 : num;
    // previous new moon, to find the lunar month
    let nm = ms - (e / 12.1907) * 86400000;
    for (let i = 0; i < 3; i++) {
      let x = elongation(nm);
      if (x > 180) x -= 360;
      nm -= (x / 12.1907) * 86400000;
    }
    const yr = dt.getFullYear();
    const ayan = 23.857 + 0.01397 * (yr - 2000);
    const rashi = Math.floor(norm(astro(nm).sun - ayan) / 30);
    const monthIdx = (rashi + 1) % 12;
    const gm = dt.getMonth() + 1;
    const samvat = gm < 3 ? yr + 56 : gm === 3 ? (monthIdx === 0 ? yr + 57 : yr + 56) : yr + 57;
    const hour = dt.getHours();
    const phase = hour >= 4 && hour < 6 ? 0 : hour >= 6 && hour < 11 ? 1 : hour >= 11 && hour < 14 ? 2 : hour >= 14 && hour < 17 ? 3 : hour >= 17 && hour < 20 ? 4 : 5;
    const p2 = (n) => (n < 10 ? "0" : "") + n;
    const dayKey = yr + "-" + p2(gm) + "-" + p2(dt.getDate());
    let festival = "";
    let festKey = "";
    if (FESTIVAL_TEXT[dayKey]) { festKey = dayKey; }
    else if (FESTIVAL_TEXT[p2(gm) + "-" + p2(dt.getDate())]) { festKey = p2(gm) + "-" + p2(dt.getDate()); }
    const FNAME = { "2026-10-10": "Mahalaya Amavasya", "2026-10-20": "Vijayadashami (Dussehra)", "2026-10-22": "Papankusha Ekadashi", "2026-10-25": "Sharad Purnima", "2026-10-29": "Karwa Chauth", "2026-11-06": "Dhanteras", "2026-11-07": "Choti Diwali", "2026-11-08": "Diwali", "2026-11-11": "Bhai Dooj", "2026-11-15": "Chhath Puja", "2026-11-21": "Tulsi Vivah", "2026-11-24": "Dev Diwali", "2026-12-04": "Utpanna Ekadashi", "2026-12-20": "Gita Jayanti", "2026-12-23": "Margashirsha Purnima", "01-14": "Makar Sankranti", "04-14": "Baisakhi" };
    if (festKey) festival = FNAME[festKey];
    let nav = 0;
    if (yr === 2026 && gm === 10 && dt.getDate() >= 11 && dt.getDate() <= 19) {
      nav = dt.getDate() - 10;
      if (!festival) festival = "Sharad Navratri, day " + nav;
      if (dt.getDate() === 19) festival = "Durga Ashtami and Maha Navami";
    }
    return {
      tithi: paksha + " " + tithiName, paksha, tithiName, tkey, num,
      month: MONTHS[monthIdx], samvat, vara: VARA[dt.getDay()], phase: PHASES[phase], phaseIdx: phase,
      dayKey, festKey, festival, nav, weekday: dt.getDay()
    };
  }
  
  function specialsFor(p) {
    const out = [];
    const push = (arr, lab, key) => arr.forEach((t, i) => out.push({ id: key + ":" + i, t, src: lab }));
    if (p.festKey) push(FESTIVAL_TEXT[p.festKey], p.festival, "F" + p.festKey);
    if (p.nav) push(NAVRATRI_TEXT, "Navratri, day " + p.nav, "N");
    push(TITHI_TEXT[p.tkey] || [], p.tithi, "T" + p.tkey);
    push(PAKSHA_TEXT[p.paksha], p.paksha + " Paksha", "P" + p.paksha);
    push(VARA_TEXT[p.weekday], p.vara, "V" + p.weekday);
    push(PHASE_TEXT[p.phaseIdx], p.phase, "H" + p.phaseIdx);
    return out;
  }
  
  const CORES = [];
  HINDU.forEach((t) => CORES.push({ t, src: "Hindu wisdom" }));
  NATURE.forEach((t) => CORES.push({ t, src: "Nature’s lesson" }));
  GLOBAL.forEach((g) => CORES.push({ t: g[0], src: g[1] }));
  
  function slotStart(y, m, d, s) { return new Date(y, m - 1, d, 0, s * 10, 0, 0).getTime(); }
  
  const dayCache = {};
  function thoughtAt(ms) {
    const dt = new Date(ms);
    const y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
    const slot = Math.floor((dt.getHours() * 60 + dt.getMinutes()) / 10);
    const dayKey = y + "-" + m + "-" + d;
    let seq = dayCache[dayKey];
    if (!seq) { seq = { used: {}, list: [] }; dayCache[dayKey] = seq; }
    for (let s = seq.list.length; s <= slot; s++) {
      const t0 = slotStart(y, m, d, s);
      const p = panchang(t0 + 5 * 60000);
      const k = dayKey + "#" + s;
      const r1 = rnd(k + "a"), r2 = rnd(k + "b"), r3 = rnd(k + "c");
      let pick = null;
      if (r1 < 0.4) {
        const avail = specialsFor(p).filter((x) => !seq.used["S" + x.id]);
        if (avail.length) {
          const x = avail[Math.floor(r2 * avail.length)];
          seq.used["S" + x.id] = true;
          pick = { text: x.t, src: x.src, id: "S" + x.id };
        }
      }
      if (!pick) {
        let i = Math.floor(r2 * CORES.length);
        let guard = 0;
        while (seq.used["C" + i] && guard < CORES.length) { i = (i + 1) % CORES.length; guard++; }
        seq.used["C" + i] = true;
        const a = Math.floor(r3 * (APPS.length + 1));
        const c = CORES[i];
        pick = { text: c.t + (a === 0 ? "" : " " + APPS[a - 1]), src: c.src, id: "C" + i + ":" + a };
      }
      seq.list.push(pick);
    }
    return Object.assign({ slot }, seq.list[slot]);
  }
  
  function approxCount() {
    const spec = Object.keys(FESTIVAL_TEXT).reduce((n, k) => n + FESTIVAL_TEXT[k].length, 0)
      + NAVRATRI_TEXT.length
      + Object.keys(TITHI_TEXT).reduce((n, k) => n + TITHI_TEXT[k].length, 0)
      + PAKSHA_TEXT.Shukla.length + PAKSHA_TEXT.Krishna.length
      + VARA_TEXT.reduce((n, a) => n + a.length, 0)
      + PHASE_TEXT.reduce((n, a) => n + a.length, 0);
    return CORES.length * (APPS.length + 1) + spec;
  }
  
  return { thoughtAt, panchang, approxCount, coreCount: CORES.length, appCount: APPS.length };
}
