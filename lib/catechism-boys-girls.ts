// ── A Catechism for Boys and Girls ───────────────────────────────────────────
// Source: Erroll Hulse, based on the 1689 Baptist Confession of Faith.
// Used in: Truth & Grace Memory Book Vol. 1 by Tom Ascol (Founders Press).
// This is the catechism the Echols family uses for discipleship.
//
// 145 questions across 5 parts:
//   Part I:   God, Man, and Sin          (Q1–33)
//   Part II:  The Ten Commandments       (Q34–67)
//   Part III: Salvation                  (Q68–106)
//   Part IV:  Prayer                     (Q107–123)
//   Part V:   Word, Church, Ordinances   (Q124–136)
//   Part VI:  The Last Things            (Q137–145)

export interface CatechismQuestion {
  number: number;
  question: string;
  answer: string;
  part: string;
  reference?: string;   // optional key scripture
}

export const CATECHISM: CatechismQuestion[] = [
  // ── Part I: God, Man, and Sin ─────────────────────────────────────────────
  { number: 1,  part: "God, Man, and Sin", question: "Who made you?", answer: "God made me.", reference: "Genesis 1:1" },
  { number: 2,  part: "God, Man, and Sin", question: "What else did God make?", answer: "God made all things.", reference: "Genesis 1:31" },
  { number: 3,  part: "God, Man, and Sin", question: "Why did God make you and all things?", answer: "For his own glory.", reference: "Isaiah 43:7" },
  { number: 4,  part: "God, Man, and Sin", question: "How can you glorify God?", answer: "By loving him and doing what he commands.", reference: "Ecclesiastes 12:13" },
  { number: 5,  part: "God, Man, and Sin", question: "Why ought you to glorify God?", answer: "Because he made me and takes care of me.", reference: "Psalm 100:3" },
  { number: 6,  part: "God, Man, and Sin", question: "Are there more gods than one?", answer: "There is only one God.", reference: "Deuteronomy 6:4" },
  { number: 7,  part: "God, Man, and Sin", question: "In how many persons does this one God exist?", answer: "In three persons.", reference: "Matthew 28:19" },
  { number: 8,  part: "God, Man, and Sin", question: "Who are they?", answer: "The Father, the Son, and the Holy Spirit.", reference: "2 Corinthians 13:14" },
  { number: 9,  part: "God, Man, and Sin", question: "Who is God?", answer: "God is a Spirit, and does not have a body like men.", reference: "John 4:24" },
  { number: 10, part: "God, Man, and Sin", question: "Where is God?", answer: "God is everywhere.", reference: "Psalm 139:7-10" },
  { number: 11, part: "God, Man, and Sin", question: "Can you see God?", answer: "No. I cannot see God, but he always sees me.", reference: "John 1:18" },
  { number: 12, part: "God, Man, and Sin", question: "Does God know all things?", answer: "Yes. Nothing can be hidden from God.", reference: "Hebrews 4:13" },
  { number: 13, part: "God, Man, and Sin", question: "Can God do all things?", answer: "Yes. God can do all his holy will.", reference: "Jeremiah 32:17" },
  { number: 14, part: "God, Man, and Sin", question: "Where do you learn how to love and obey God?", answer: "In the Bible alone.", reference: "2 Timothy 3:16-17" },
  { number: 15, part: "God, Man, and Sin", question: "Who wrote the Bible?", answer: "Holy men who were taught by the Holy Spirit.", reference: "2 Peter 1:21" },
  { number: 16, part: "God, Man, and Sin", question: "Who were our first parents?", answer: "Adam and Eve.", reference: "Genesis 3:20" },
  { number: 17, part: "God, Man, and Sin", question: "Of what were our first parents made?", answer: "God created Adam's body from earth and formed Eve from Adam's body.", reference: "Genesis 2:7, 22" },
  { number: 18, part: "God, Man, and Sin", question: "What did God give Adam and Eve besides bodies?", answer: "He gave them souls that could never die.", reference: "Genesis 2:7" },
  { number: 19, part: "God, Man, and Sin", question: "Have you a soul as well as a body?", answer: "Yes. I have a soul that can never die.", reference: "Matthew 10:28" },
  { number: 20, part: "God, Man, and Sin", question: "How do you know that you have a soul?", answer: "Because the Bible tells me so.", reference: "Genesis 2:7" },
  { number: 21, part: "God, Man, and Sin", question: "What is your soul?", answer: "My soul includes all of me that should know and love God.", reference: "Matthew 22:37" },
  { number: 22, part: "God, Man, and Sin", question: "In what condition did God make Adam and Eve?", answer: "He made them holy and happy.", reference: "Genesis 1:31" },
  { number: 23, part: "God, Man, and Sin", question: "Did Adam and Eve stay holy and happy?", answer: "No. They sinned against God.", reference: "Genesis 3:6" },
  { number: 24, part: "God, Man, and Sin", question: "What was the sin of our first parents?", answer: "Eating the forbidden fruit.", reference: "Genesis 3:6" },
  { number: 25, part: "God, Man, and Sin", question: "Why did they eat the forbidden fruit?", answer: "Because they did not believe what God had said.", reference: "Genesis 3:4-6" },
  { number: 26, part: "God, Man, and Sin", question: "Who tempted them to this sin?", answer: "The devil tempted Eve, and she gave the fruit to Adam.", reference: "Genesis 3:1-6" },
  { number: 27, part: "God, Man, and Sin", question: "What happened to our first parents when they had sinned?", answer: "They became sinful and miserable instead of holy and happy.", reference: "Genesis 3:16-19" },
  { number: 28, part: "God, Man, and Sin", question: "What effect did the sin of Adam have on all mankind?", answer: "All mankind is born in a state of sin and misery.", reference: "Romans 5:12" },
  { number: 29, part: "God, Man, and Sin", question: "What do we inherit from Adam as a result of this original sin?", answer: "A sinful nature.", reference: "Psalm 51:5" },
  { number: 30, part: "God, Man, and Sin", question: "What is sin?", answer: "Sin is any transgression of the law of God.", reference: "1 John 3:4" },
  { number: 31, part: "God, Man, and Sin", question: "What is meant by transgression?", answer: "Doing what God forbids.", reference: "Romans 1:21-32" },
  { number: 32, part: "God, Man, and Sin", question: "What does every sin deserve?", answer: "The anger and judgment of God.", reference: "Romans 6:23" },
  { number: 33, part: "God, Man, and Sin", question: "Do we know what God requires of us?", answer: "Yes, he has given us his law both in our hearts and in writing.", reference: "Romans 2:15" },

  // ── Part II: The Ten Commandments ─────────────────────────────────────────
  { number: 34, part: "The Ten Commandments", question: "How many commandments did God give on Mt. Sinai?", answer: "Ten commandments.", reference: "Exodus 20:1-17" },
  { number: 35, part: "The Ten Commandments", question: "What are the ten commandments sometimes called?", answer: "God's moral law.", reference: "Deuteronomy 4:13" },
  { number: 36, part: "The Ten Commandments", question: "What do the first four commandments teach?", answer: "Our duty to God.", reference: "Matthew 22:37-38" },
  { number: 37, part: "The Ten Commandments", question: "What do the last six commandments teach?", answer: "Our duty to our fellow men.", reference: "Matthew 22:39" },
  { number: 38, part: "The Ten Commandments", question: "What is the sum of the ten commandments?", answer: "To love God with all my heart, and my neighbor as myself.", reference: "Matthew 22:37-39" },
  { number: 39, part: "The Ten Commandments", question: "Who is your neighbor?", answer: "All my fellow men are my neighbors.", reference: "Luke 10:29-37" },
  { number: 40, part: "The Ten Commandments", question: "Is God pleased with those who love and obey him?", answer: "Yes. He says, 'I love them that love me.'", reference: "Proverbs 8:17" },
  { number: 41, part: "The Ten Commandments", question: "Is God pleased with those who do not love and obey him?", answer: "No. 'God is angry with the wicked every day.'", reference: "Psalm 7:11" },
  { number: 42, part: "The Ten Commandments", question: "What is the first commandment?", answer: "Thou shalt have no other gods before me.", reference: "Exodus 20:3" },
  { number: 43, part: "The Ten Commandments", question: "What does the first commandment teach us?", answer: "To worship God only.", reference: "Matthew 4:10" },
  { number: 44, part: "The Ten Commandments", question: "What is the second commandment?", answer: "You shall not make for yourself a carved image or any likeness of anything to worship it.", reference: "Exodus 20:4-6" },
  { number: 45, part: "The Ten Commandments", question: "What does the second commandment teach us?", answer: "To worship God in the right way, and to avoid idolatry.", reference: "John 4:24" },
  { number: 46, part: "The Ten Commandments", question: "What is the third commandment?", answer: "Thou shalt not take the name of the Lord thy God in vain.", reference: "Exodus 20:7" },
  { number: 47, part: "The Ten Commandments", question: "What does the third commandment teach us?", answer: "To reverence God's name, word, and works.", reference: "Psalm 111:9" },
  { number: 48, part: "The Ten Commandments", question: "What is the fourth commandment?", answer: "Remember the Sabbath day to keep it holy.", reference: "Exodus 20:8-11" },
  { number: 49, part: "The Ten Commandments", question: "What does the fourth commandment teach us?", answer: "To keep the Sabbath holy.", reference: "Exodus 20:8" },
  { number: 50, part: "The Ten Commandments", question: "What day of the week is the Christian Sabbath?", answer: "The first day of the week, called the Lord's Day.", reference: "Revelation 1:10" },
  { number: 51, part: "The Ten Commandments", question: "Why is it called the Lord's Day?", answer: "Because on that day Christ rose from the dead.", reference: "Mark 16:9" },
  { number: 52, part: "The Ten Commandments", question: "How should the Sabbath be kept?", answer: "In prayer and praise, in hearing and reading God's Word.", reference: "Isaiah 58:13-14" },
  { number: 53, part: "The Ten Commandments", question: "What is the fifth commandment?", answer: "Honor thy father and thy mother that thy days may be long upon the land.", reference: "Exodus 20:12" },
  { number: 54, part: "The Ten Commandments", question: "What does the fifth commandment teach us?", answer: "To love and obey our parents.", reference: "Ephesians 6:1-3" },
  { number: 55, part: "The Ten Commandments", question: "What is the sixth commandment?", answer: "Thou shalt not kill.", reference: "Exodus 20:13" },
  { number: 56, part: "The Ten Commandments", question: "What does the sixth commandment teach us?", answer: "To avoid hatred, all that leads to it, and all that follows from it.", reference: "Matthew 5:21-22" },
  { number: 57, part: "The Ten Commandments", question: "What is the seventh commandment?", answer: "Thou shalt not commit adultery.", reference: "Exodus 20:14" },
  { number: 58, part: "The Ten Commandments", question: "What does the seventh commandment teach us?", answer: "To be pure in heart, language, and conduct.", reference: "Matthew 5:27-28" },
  { number: 59, part: "The Ten Commandments", question: "What is the eighth commandment?", answer: "Thou shalt not steal.", reference: "Exodus 20:15" },
  { number: 60, part: "The Ten Commandments", question: "What does the eighth commandment teach us?", answer: "To be honest and not to take the things of others.", reference: "Ephesians 4:28" },
  { number: 61, part: "The Ten Commandments", question: "What is the ninth commandment?", answer: "Thou shalt not bear false witness against thy neighbor.", reference: "Exodus 20:16" },
  { number: 62, part: "The Ten Commandments", question: "What does the ninth commandment teach us?", answer: "To tell the truth and not to speak evil of others.", reference: "Ephesians 4:25" },
  { number: 63, part: "The Ten Commandments", question: "What is the tenth commandment?", answer: "Thou shalt not covet anything that belongs to your neighbor.", reference: "Exodus 20:17" },
  { number: 64, part: "The Ten Commandments", question: "What does the tenth commandment teach us?", answer: "To be content with what we have.", reference: "Hebrews 13:5" },
  { number: 65, part: "The Ten Commandments", question: "Can any man keep these ten commandments?", answer: "No mere man, since the fall of Adam, ever did or can keep the ten commandments perfectly.", reference: "Romans 3:23" },
  { number: 66, part: "The Ten Commandments", question: "Of what use are the ten commandments to us?", answer: "They teach us our duty, make clear our condemnation, and show us our need of a Saviour.", reference: "Galatians 3:24" },
  { number: 67, part: "The Ten Commandments", question: "Does God condemn all men?", answer: "No. Though he could justly have done so, he has graciously entered into a covenant to save many.", reference: "John 3:16" },

  // ── Part III: Salvation ───────────────────────────────────────────────────
  { number: 68,  part: "Salvation", question: "What is a covenant?", answer: "A covenant is an agreement between two or more persons.", reference: "Genesis 17:7" },
  { number: 69,  part: "Salvation", question: "What is the covenant of grace?", answer: "It is an eternal agreement within the Trinity to save certain persons called the elect.", reference: "Ephesians 1:4" },
  { number: 70,  part: "Salvation", question: "What did Christ undertake in the covenant of grace?", answer: "Christ undertook to keep the whole law for his people, and to suffer the punishment due to their sins.", reference: "Galatians 4:4-5" },
  { number: 71,  part: "Salvation", question: "Did our Lord Jesus Christ ever sin?", answer: "No. He was holy, blameless, and undefiled.", reference: "Hebrews 7:26" },
  { number: 72,  part: "Salvation", question: "How could the Son of God suffer?", answer: "Christ, the Son of God, took flesh and blood, that he might obey and suffer as a man.", reference: "John 1:14" },
  { number: 73,  part: "Salvation", question: "What is meant by the atonement?", answer: "Christ satisfied divine justice through his sufferings and death in place of sinners.", reference: "Romans 5:8-9" },
  { number: 74,  part: "Salvation", question: "For whom did Christ obey and suffer?", answer: "Christ obeyed and suffered for those whom the Father had given him.", reference: "John 17:9" },
  { number: 75,  part: "Salvation", question: "What kind of life did Christ live on earth?", answer: "Christ lived a life of perfect obedience to the law of God.", reference: "Hebrews 4:15" },
  { number: 76,  part: "Salvation", question: "What kind of death did Christ die?", answer: "Christ experienced the painful and shameful death of the cross.", reference: "Philippians 2:8" },
  { number: 77,  part: "Salvation", question: "Who will be saved?", answer: "Only those who repent of sin and believe in Christ will be saved.", reference: "Acts 16:31" },
  { number: 78,  part: "Salvation", question: "What is it to repent?", answer: "Repentance involves sorrow for sin, leading one to hate and forsake it.", reference: "Acts 3:19" },
  { number: 79,  part: "Salvation", question: "What is it to believe in Christ?", answer: "A person believes who knows that his only hope is Christ and trusts in Christ alone for salvation.", reference: "John 3:16" },
  { number: 80,  part: "Salvation", question: "How were godly persons saved before the coming of Christ?", answer: "They believed in the Saviour to come.", reference: "Hebrews 11:13" },
  { number: 81,  part: "Salvation", question: "How did they show their faith?", answer: "They offered sacrifices according to God's commands.", reference: "Leviticus 1:3-4" },
  { number: 82,  part: "Salvation", question: "What did these sacrifices represent?", answer: "They were symbolic of Christ, the Lamb of God, who was to die for sinners.", reference: "John 1:29" },
  { number: 83,  part: "Salvation", question: "What does Christ do for his people?", answer: "He does the work of a prophet, a priest, and a king.", reference: "Acts 3:22; Hebrews 5:6; Luke 1:33" },
  { number: 84,  part: "Salvation", question: "How is Christ a prophet?", answer: "He teaches us the will of God, reveals God to us, and really was God in human flesh.", reference: "John 1:18" },
  { number: 85,  part: "Salvation", question: "Why do you need Christ as a prophet?", answer: "Because I am ignorant.", reference: "1 Corinthians 1:30" },
  { number: 86,  part: "Salvation", question: "How is Christ a priest?", answer: "He died for our sins and prays to God for us.", reference: "Hebrews 7:25-27" },
  { number: 87,  part: "Salvation", question: "Why do you need Christ as a priest?", answer: "Because I am guilty.", reference: "Romans 3:23-24" },
  { number: 88,  part: "Salvation", question: "How is Christ a king?", answer: "He rules over us and defends us.", reference: "Psalm 2:6" },
  { number: 89,  part: "Salvation", question: "Why do you need Christ as a king?", answer: "Because I am weak and helpless.", reference: "Philippians 4:13" },
  { number: 90,  part: "Salvation", question: "What did God the Father undertake in the covenant of grace?", answer: "God the Father elected and determined to justify, adopt, and sanctify those for whom Christ would die.", reference: "Ephesians 1:3-5" },
  { number: 91,  part: "Salvation", question: "What is election?", answer: "It is God's goodness as revealed in his grace by choosing certain sinners for salvation.", reference: "Ephesians 1:4-5" },
  { number: 92,  part: "Salvation", question: "What is justification?", answer: "It is God's regarding sinners as if they had never sinned and granting them righteousness.", reference: "Romans 4:5" },
  { number: 93,  part: "Salvation", question: "What is righteousness?", answer: "It is God's goodness as revealed in his law, and as honored in Christ's perfect obedience to that law.", reference: "Romans 5:19" },
  { number: 94,  part: "Salvation", question: "Can anyone be saved by his own righteousness?", answer: "No. No one is good enough for God.", reference: "Isaiah 64:6" },
  { number: 95,  part: "Salvation", question: "What is adoption?", answer: "It is God's goodness in receiving sinful rebels as his beloved children.", reference: "1 John 3:1" },
  { number: 96,  part: "Salvation", question: "What is sanctification?", answer: "God makes sinners holy in heart and conduct to demonstrate his goodness in their lives.", reference: "1 Thessalonians 4:3" },
  { number: 97,  part: "Salvation", question: "Is this process of sanctification ever complete in this life?", answer: "No. It is certain and continual, but is complete only in heaven.", reference: "Philippians 1:6" },
  { number: 98,  part: "Salvation", question: "What hinders the completion of sanctification in this life?", answer: "The flesh lusts against the Spirit so that you cannot do the things you would.", reference: "Galatians 5:17" },
  { number: 99,  part: "Salvation", question: "Since we are by nature sinful, how can one ever desire to be holy?", answer: "Our hearts must be changed before we can be fit for heaven.", reference: "Ezekiel 36:26" },
  { number: 100, part: "Salvation", question: "Who can change a sinner's heart?", answer: "Only the Holy Spirit can change a sinner's heart.", reference: "John 3:5-8" },
  { number: 101, part: "Salvation", question: "What did the Holy Spirit undertake in the covenant of grace?", answer: "He regenerates, baptizes, and seals those for whom Christ has died.", reference: "2 Corinthians 1:22" },
  { number: 102, part: "Salvation", question: "What is regeneration?", answer: "It is a change of heart that leads to true repentance and faith.", reference: "John 3:3" },
  { number: 103, part: "Salvation", question: "Can you repent and believe in Christ by your own power?", answer: "No. I can do nothing good without God's Holy Spirit.", reference: "John 15:5" },
  { number: 104, part: "Salvation", question: "How does the Holy Spirit baptize believers?", answer: "He puts them into the body of Christ by making them a living part of all those who truly believe in him.", reference: "1 Corinthians 12:13" },
  { number: 105, part: "Salvation", question: "How does the Holy Spirit seal believers?", answer: "He comes to live within them to guarantee that they will receive the wonders God has promised.", reference: "Ephesians 1:13-14" },
  { number: 106, part: "Salvation", question: "How can you receive the Holy Spirit?", answer: "We must pray to God for the Holy Spirit, with evidence seen in trust and love for Jesus Christ.", reference: "Luke 11:13" },

  // ── Part IV: Prayer ───────────────────────────────────────────────────────
  { number: 107, part: "Prayer", question: "What is prayer?", answer: "Prayer is talking with God.", reference: "Philippians 4:6" },
  { number: 108, part: "Prayer", question: "In whose name should we pray?", answer: "We should pray in the name of the Lord Jesus.", reference: "John 16:23-24" },
  { number: 109, part: "Prayer", question: "What has Christ given to teach us how to pray?", answer: "The Lord's Prayer.", reference: "Matthew 6:9-13" },
  { number: 110, part: "Prayer", question: "Can you repeat the Lord's Prayer?", answer: "Our Father which art in heaven, hallowed be thy name. Thy kingdom come, thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. For thine is the kingdom, and the power, and the glory, forever. Amen.", reference: "Matthew 6:9-13" },
  { number: 111, part: "Prayer", question: "How many petitions are there in the Lord's Prayer?", answer: "Six.", reference: "Matthew 6:9-13" },
  { number: 112, part: "Prayer", question: "What is the first petition?", answer: "Hallowed be thy name.", reference: "Matthew 6:9" },
  { number: 113, part: "Prayer", question: "What do we pray for in the first petition?", answer: "That God's name may be honored by us and all men.", reference: "Psalm 148:13" },
  { number: 114, part: "Prayer", question: "What is the second petition?", answer: "Thy kingdom come.", reference: "Matthew 6:10" },
  { number: 115, part: "Prayer", question: "What do we pray for in the second petition?", answer: "That the gospel may be preached in all the world, and believed and obeyed by us and all men.", reference: "Matthew 24:14" },
  { number: 116, part: "Prayer", question: "What is the third petition?", answer: "Thy will be done in earth, as it is in heaven.", reference: "Matthew 6:10" },
  { number: 117, part: "Prayer", question: "What do we pray for in the third petition?", answer: "That men on earth may serve God as the angels do in heaven.", reference: "Psalm 103:20-21" },
  { number: 118, part: "Prayer", question: "What is the fourth petition?", answer: "Give us this day our daily bread.", reference: "Matthew 6:11" },
  { number: 119, part: "Prayer", question: "What do we pray for in the fourth petition?", answer: "That God will give us all things needful for our bodies.", reference: "Proverbs 30:8-9" },
  { number: 120, part: "Prayer", question: "What is the fifth petition?", answer: "And forgive us our trespasses, as we forgive them that trespass against us.", reference: "Matthew 6:12" },
  { number: 121, part: "Prayer", question: "What do we pray for in the fifth petition?", answer: "That God will pardon our sins, and help us to forgive those who have sinned against us.", reference: "1 John 1:9" },
  { number: 122, part: "Prayer", question: "What is the sixth petition?", answer: "And lead us not into temptation, but deliver us from evil.", reference: "Matthew 6:13" },
  { number: 123, part: "Prayer", question: "What do we pray for in the sixth petition?", answer: "That God will keep us from sin.", reference: "Psalm 141:3-4" },

  // ── Part V: Word, Church, Ordinances ─────────────────────────────────────
  { number: 124, part: "Word, Church, and Ordinances", question: "How does the Holy Spirit bring us to salvation?", answer: "He uses the Bible, which is the Word of God.", reference: "Romans 10:17" },
  { number: 125, part: "Word, Church, and Ordinances", question: "How can we know the Word of God?", answer: "We are commanded to hear, read, and search the Scriptures.", reference: "John 5:39" },
  { number: 126, part: "Word, Church, and Ordinances", question: "What is a church?", answer: "A church is an assembly of baptized believers joined by a covenant of discipline and witness.", reference: "Acts 2:41-42" },
  { number: 127, part: "Word, Church, and Ordinances", question: "What two ordinances did Christ give to his Church?", answer: "Baptism and the Lord's Supper.", reference: "Matthew 28:19; 1 Corinthians 11:23-26" },
  { number: 128, part: "Word, Church, and Ordinances", question: "Why did Christ give these ordinances?", answer: "To show that his disciples belong to him, and to remind them of what he has done for them.", reference: "Romans 6:3-4" },
  { number: 129, part: "Word, Church, and Ordinances", question: "What is baptism?", answer: "The dipping of believers into water, as a sign of their union with Christ in his death, burial, and resurrection.", reference: "Romans 6:3-4" },
  { number: 130, part: "Word, Church, and Ordinances", question: "What is the purpose of baptism?", answer: "Baptism testifies to believers that God has cleansed them from their sins through Jesus Christ.", reference: "Acts 22:16" },
  { number: 131, part: "Word, Church, and Ordinances", question: "Who are to be baptized?", answer: "Only those who repent of their sins and believe in Christ for salvation should be baptized.", reference: "Acts 8:36-37" },
  { number: 132, part: "Word, Church, and Ordinances", question: "Should babies be baptized?", answer: "No; because the Bible neither commands it, nor gives any example of it.", reference: "Acts 2:38" },
  { number: 133, part: "Word, Church, and Ordinances", question: "What is the Lord's Supper?", answer: "At the Lord's Supper, the church eats bread and drinks wine to remember the sufferings and death of Christ.", reference: "1 Corinthians 11:23-26" },
  { number: 134, part: "Word, Church, and Ordinances", question: "What does the bread represent?", answer: "The bread represents the body of Christ, broken for our sins.", reference: "1 Corinthians 11:24" },
  { number: 135, part: "Word, Church, and Ordinances", question: "What does the wine represent?", answer: "The wine represents the blood of Christ, shed for our salvation.", reference: "1 Corinthians 11:25" },
  { number: 136, part: "Word, Church, and Ordinances", question: "Who should partake of the Lord's Supper?", answer: "The Lord's Supper is for those only who repent of their sins, believe in Christ for salvation, receive baptism, and love their fellow men.", reference: "1 Corinthians 11:28-29" },

  // ── Part VI: The Last Things ──────────────────────────────────────────────
  { number: 137, part: "The Last Things", question: "Did Christ remain in the tomb after his crucifixion?", answer: "No. He rose from the tomb on the third day after his death.", reference: "1 Corinthians 15:4" },
  { number: 138, part: "The Last Things", question: "Where is Christ now?", answer: "Christ is in heaven, seated at the right hand of God the Father.", reference: "Hebrews 1:3" },
  { number: 139, part: "The Last Things", question: "Will Christ come again?", answer: "Yes. At the last day he will come to judge the world.", reference: "Acts 1:11" },
  { number: 140, part: "The Last Things", question: "What happens to men when they die?", answer: "The body returns to dust, and the soul goes to be with God or to a place of suffering.", reference: "2 Corinthians 5:8" },
  { number: 141, part: "The Last Things", question: "Will the bodies of the dead be raised to life again?", answer: "Yes. There shall be a resurrection of the dead, both of the just and unjust.", reference: "Acts 24:15" },
  { number: 142, part: "The Last Things", question: "What will happen to the wicked in the day of judgment?", answer: "They shall be cast into hell.", reference: "Revelation 20:15" },
  { number: 143, part: "The Last Things", question: "What is hell?", answer: "Hell is a place of dreadful and endless punishment.", reference: "Matthew 25:46" },
  { number: 144, part: "The Last Things", question: "What will happen to the righteous in the day of judgment?", answer: "They shall live with Christ for ever, in a new heaven and a new earth.", reference: "Revelation 21:1-4" },
  { number: 145, part: "The Last Things", question: "In light of these truths, what should you do?", answer: "I should strive with all my energy to repent of sin and believe savingly in the Lord Jesus Christ.", reference: "Mark 1:15" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getCatechismQuestion(number: number): CatechismQuestion | undefined {
  return CATECHISM.find(q => q.number === number);
}

export function getCatechismPart(partName: string): CatechismQuestion[] {
  return CATECHISM.filter(q => q.part === partName);
}

export const CATECHISM_PARTS = [
  "God, Man, and Sin",
  "The Ten Commandments",
  "Salvation",
  "Prayer",
  "Word, Church, and Ordinances",
  "The Last Things",
] as const;

// ── Quick quiz helpers ────────────────────────────────────────────────────────
/** Returns a range of questions for a given grade/difficulty window */
export function getCatechismRange(from: number, to: number): CatechismQuestion[] {
  return CATECHISM.filter(q => q.number >= from && q.number <= to);
}

/** Per-kid recommended ranges based on age */
export const KID_CATECHISM_RANGES: Record<string, { from: number; to: number; label: string }> = {
  lois:  { from: 1,   to: 10,  label: "Who Made Me?" },
  mercy: { from: 1,   to: 33,  label: "God, Man & Sin" },
  titus: { from: 1,   to: 67,  label: "God, Sin & the Law" },
  truma: { from: 1,   to: 145, label: "Full Catechism" },
};
