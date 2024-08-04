export interface Root {
  eiUserId: string
  gameServicesId: string
  pushUserId: string
  deviceId: string
  userName: string
  approxTime: number
  version: number
  forceOfferBackup: boolean
  forceBackup: boolean
  settings: Settings
  tutorial: Tutorial
  stats: Stats
  game: Game
  artifacts: Artifacts
  shells: Shells
  farmsList: FarmsList[]
  mission: Mission
  misc: Misc
  contracts: Contracts
  artifactsDb: ArtifactsDb
  shellDb: ShellDb
  readMailIdsList: any[]
  mailState: MailState
  checksum: number
}

export interface Settings {
  sfx: boolean
  music: boolean
  lowBatteryMode: boolean
  lowPerformanceMode: boolean
  forceTouchChickenBtn: boolean
  lastNotificationQueryTime: number
  notificationsOn: boolean
  notifyDailyGift: boolean
  lowPerformance: boolean
  autoStopFueling: boolean
  maxEnabled: boolean
  hideCcStatus: boolean
  contractsWidgetEnabled: boolean
  artifactSparkle: boolean
  lastBackupTime: number
  ageRestricted: boolean
  dataCollectionConsentQueried: boolean
  dataCollectionConsentGiven: boolean
  userAdsEnabled: boolean
  userCloudEnabled: boolean
  userAnalyticsEnabled: boolean
  userPersonalizedAdsEnabled: boolean
}

export interface Tutorial {
  introShown: boolean
  clickTutorialShown: boolean
  qNumShown: boolean
  sNumShown: boolean
  tutorialShownList: boolean[]
}

export interface Stats {
  eggTotalsOldList: any[]
  eggTotalsList: number[]
  boostsUsed: number
  videoDoublerUses: number
  droneTakedowns: number
  droneTakedownsElite: number
  numPrestiges: number
  numPiggyBreaks: number
  iapPacksPurchased: number
  piggyFull: boolean
  piggyFoundFull: boolean
  timePiggyFilledRealtime: number
  timePiggyFullGametime: number
  lostPiggyIncrements: number
}

export interface Game {
  currentFarm: number
  maxEggReached: number
  goldenEggsEarned: number
  goldenEggsSpent: number
  uncliamedGoldenEggs: number
  soulEggsD: number
  unclaimedSoulEggsD: number
  eggsOfProphecy: number
  unclaimedEggsOfProphecy: number
  shellScriptsEarned: number
  shellScriptsSpent: number
  unclaimedShellScripts: number
  prestigeCashEarned: number
  prestigeSoulBoostCash: number
  lifetimeCashEarned: number
  piggyBank: number
  piggyFullAlertShown: boolean
  permitLevel: number
  epicResearchList: EpicResearchList[]
  hyperloopStation: boolean
  nextDailyGiftTime: number
  lastDailyGiftCollectedDay: number
  numDailyGiftsCollected: number
  newsList: NewsList[]
  lastNewsTime: number
  currentMultiplier: number
  currentMultiplierExpiration: number
  achievementsList: AchievementsList[]
  maxFarmSizeReachedList: number[]
  eggMedalLevelList: number[]
  longIdleNotificationSet: boolean
  longIdleNotificationThreshold: number
  longIdleReward: number
  boostsList: BoostsList[]
  totalTimeCheatsDetected: number
  forceEliteContracts: boolean
  newPlayerEventEndTime: number
}

export interface EpicResearchList {
  id: string
  level: number
}

export interface NewsList {
  id: string
  read: boolean
}

export interface AchievementsList {
  id: string
  achieved: boolean
}

export interface BoostsList {
  boostId: string
  count: number
}

export interface Artifacts {
  flowPercentageArtifacts: number
  fuelingEnabled: boolean
  tankFillingEnabled: boolean
  tankLevel: number
  tankFuelsList: number[]
  tankLimitsList: number[]
  lastFueledShip: number
  inventoryScore: number
  craftingXp: number
  enabled: boolean
  introShown: boolean
  infusingEnabledDeprecated: boolean
}

export interface Shells {
  introAlert: boolean
  contractsIntroAlert: boolean
  numNewList: number[]
}

export interface FarmsList {
  eggType: number
  farmType: number
  contractId: string
  cashEarned: number
  cashSpent: number
  unclaimedCash: number
  lastStepTime: number
  numChickens: number
  numChickensUnsettled: number
  numChickensRunning: number
  eggsLaid: number
  eggsShipped: number
  eggsPaidFor: number
  silosOwned: number
  habsList: number[]
  habPopulationList: number[]
  habPopulationIndoundList: number[]
  habIncubatorPopuplationList: number[]
  hatcheryPopulation: number
  vehiclesList: number[]
  trainLengthList: number[]
  commonResearchList: CommonResearchList[]
  activeBoostsList: ActiveBoostsList[]
  lastCashBoostTime: number
  timeCheatsDetected: number
  timeCheatDebt: number
  boostTokensReceived: number
  boostTokensSpent: number
  boostTokensGiven: number
  unclaimedBoostTokens: number
  gametimeUntilNextBoostToken: number
}

export interface CommonResearchList {
  id: string
  level: number
}

export interface ActiveBoostsList {
  boostId: string
  timeRemaining: number
  referenceValue: number
}

export interface Mission {
  currentMissionsList: any[]
  missionsList: MissionsList[]
}

export interface MissionsList {
  id: string
  completed: boolean
  referenceValue: number
}

export interface Misc {
  chickenBtnPrefBig: boolean
  freeHatcheryRefillGiven: boolean
  lastShareFarmValue: number
  lastShareSwarmFarmValue: number
  lastShareSwarmSize: number
  lastPrestigeAlertSoulEggsDeprecated: number
  friendRank: number
  friendRankPop: number
  globalRank: number
  globalRankPop: number
  challengesAlert: boolean
  trophyAlert: boolean
  arAlert: boolean
  contractsAlert: boolean
  contractsAlertV2: boolean
  coopAlert: boolean
  coopAlertV2: boolean
  switchAlert: boolean
  eggOfProphecyAlert: boolean
  boostTokenAlert: boolean
  soulEggAlert: boolean
  backupReminderAlert: boolean
  maxButtonAlert: boolean
  missionTargetAlert: boolean
  colleggtiblesAlert: boolean
}

export interface Contracts {
  contractIdsSeenList: string[]
  contractsList: ContractsList[]
  archiveList: ArchiveList[]
  currentCoopStatusesList: CurrentCoopStatusesList[]
  lastCpi: LastCpi
  initialGradeRevealed: boolean
  lastGradeProgressShown: number
  showAdvancedEvaluations: boolean
  customEggInfoList: CustomEggInfoList[]
}

export interface ContractsList {
  contract: Contract
  coopIdentifier: string
  accepted: boolean
  timeAccepted: number
  cancelled: boolean
  coopSharedEndTime: number
  coopSimulationEndTime: number
  coopGracePeriodEndTime: number
  coopContributionFinalized: boolean
  coopLastUploadedContribution: number
  coopUserId: string
  coopShareFarm: boolean
  lastAmountWhenRewardGiven: number
  numGoalsAchieved: number
  maxFarmSizeReached: number
  boostsUsed: number
  pointsReplay: boolean
  grade: number
  lastNagTime?: number
  reportedUuidsList: any[]
  league?: number
}

export interface Contract {
  identifier: string
  name: string
  description: string
  egg: number
  customEggId: string
  goalsList: any[]
  goalSetsList: GoalSetsList[]
  gradeSpecsList: GradeSpecsList[]
  seasonId: string
  coopAllowed: boolean
  maxCoopSize: number
  maxBoosts: number
  minutesPerToken: number
  chickenRunCooldownMinutes: number
  startTime: number
  expirationTime: number
  lengthSeconds: number
  maxSoulEggs: number
  minClientVersion: number
  leggacy: boolean
  ccOnly: boolean
  defaultShellIdsList: string[]
  debug: boolean
}

export interface GoalSetsList {
  goalsList: GoalsList[]
}

export interface GoalsList {
  type: number
  targetAmount: number
  rewardType: number
  rewardSubType: string
  rewardAmount: number
  targetSoulEggs: number
}

export interface GradeSpecsList {
  grade: number
  goalsList: GoalsList2[]
  modifiersList: any[]
  lengthSeconds: number
}

export interface GoalsList2 {
  type: number
  targetAmount: number
  rewardType: number
  rewardSubType: string
  rewardAmount: number
  targetSoulEggs: number
}

export interface ArchiveList {
  contract: Contract2
  accepted: boolean
  timeAccepted: number
  cancelled: boolean
  league?: number
  reportedUuidsList: any[]
  coopIdentifier?: string
  coopSharedEndTime?: number
  coopGracePeriodEndTime?: number
  coopContributionFinalized?: boolean
  coopLastUploadedContribution?: number
  coopUserId?: string
  coopShareFarm?: boolean
  lastAmountWhenRewardGiven?: number
  numGoalsAchieved?: number
  pointsReplay?: boolean
  grade?: number
  lastNagTime?: number
  boostsUsed?: number
  coopSimulationEndTime?: number
  maxFarmSizeReached?: number
}

export interface Contract2 {
  identifier: string
  name: string
  description: string
  egg: number
  goalsList: GoalsList3[]
  goalSetsList: GoalSetsList2[]
  gradeSpecsList: GradeSpecsList2[]
  seasonId?: string
  coopAllowed: boolean
  maxCoopSize: number
  maxBoosts: number
  minutesPerToken: number
  chickenRunCooldownMinutes: number
  startTime: number
  expirationTime: number
  lengthSeconds: number
  maxSoulEggs: number
  minClientVersion: number
  leggacy: boolean
  ccOnly?: boolean
  defaultShellIdsList: string[]
  debug: boolean
  customEggId?: string
}

export interface GoalsList3 {
  type: number
  targetAmount: number
  rewardType: number
  rewardSubType: string
  rewardAmount: number
  targetSoulEggs: number
}

export interface GoalSetsList2 {
  goalsList: GoalsList4[]
}

export interface GoalsList4 {
  type: number
  targetAmount: number
  rewardType: number
  rewardSubType: string
  rewardAmount: number
  targetSoulEggs: number
}

export interface GradeSpecsList2 {
  grade: number
  goalsList: GoalsList5[]
  modifiersList: ModifiersList[]
  lengthSeconds: number
}

export interface GoalsList5 {
  type: number
  targetAmount: number
  rewardType: number
  rewardSubType: string
  rewardAmount: number
  targetSoulEggs: number
}

export interface ModifiersList {
  dimension: number
  value: number
}

export interface CurrentCoopStatusesList {
  responseStatus: number
  contractIdentifier: string
  totalAmount: number
  coopIdentifier: string
  grade: number
  contributorsList: ContributorsList[]
  autoGenerated: boolean
  pb_public: boolean
  creatorId: string
  secondsRemaining: number
  allGoalsAchieved: boolean
  allMembersReporting: boolean
  gracePeriodSecondsRemaining: number
  clearedForExit: boolean
  giftsList: any[]
  chickenRunsList: any[]
  localTimestamp: number
  lastSync: number
}

export interface ContributorsList {
  uuid: string
  userId: string
  userName: string
  contractIdentifier: string
  contributionAmount: number
  contributionRate: number
  soulPower: number
  productionParams: ProductionParams
  farmInfo?: FarmInfo
  recentlyActive: boolean
  active: boolean
  ccMember: boolean
  leech: boolean
  finalized: boolean
  timeCheatDetected: boolean
  platform: number
  autojoined: boolean
  boostTokens?: number
  boostTokensSpent?: number
  buffHistoryList: BuffHistoryList[]
  chickenRunCooldown: number
}

export interface ProductionParams {
  farmPopulation?: number
  farmCapacity?: number
  elr?: number
  ihr?: number
  sr?: number
  delivered?: number
}

export interface FarmInfo {
  clientVersion: number
  soulEggs: number
  eggsOfProphecy: number
  permitLevel: number
  hyperloopStation: boolean
  eggMedalLevelList: number[]
  epicResearchList: EpicResearchList2[]
  eggType: number
  cashOnHand: number
  habsList: number[]
  habPopulationList: number[]
  habCapacityList: number[]
  vehiclesList: number[]
  trainLengthList: number[]
  silosOwned: number
  commonResearchList: CommonResearchList2[]
  activeBoostsList: ActiveBoostsList2[]
  boostTokensOnHand: number
  equippedArtifactsList: EquippedArtifactsList[]
  artifactInventoryScore: number
  farmAppearance: FarmAppearance
  timestamp: number
}

export interface EpicResearchList2 {
  id: string
  level: number
}

export interface CommonResearchList2 {
  id: string
  level: number
}

export interface ActiveBoostsList2 {
  boostId: string
  timeRemaining: number
  referenceValue: number
}

export interface EquippedArtifactsList {
  spec: Spec
  stonesList: StonesList[]
}

export interface Spec {
  name: number
  level: number
  rarity: number
  egg: number
}

export interface StonesList {
  name: number
  level: number
  rarity: number
  egg: number
}

export interface FarmAppearance {
  lockedElementsList: any[]
  shellConfigsList: ShellConfigsList[]
  shellSetConfigsList: ShellSetConfigsList[]
  configureChickensByGroup: boolean
  groupConfigsList: GroupConfigsList[]
  chickenConfigsList: any[]
  lightingConfigEnabled: boolean
}

export interface ShellConfigsList {
  assetType: number
  index: number
  shellIdentifier: string
}

export interface ShellSetConfigsList {
  element: number
  index: number
  shellSetIdentifier: string
  variationIdentifier: string
  decoratorIdentifier: string
}

export interface GroupConfigsList {
  assetType: number
  groupIdentifier: string
}

export interface BuffHistoryList {
  eggLayingRate: number
  earnings: number
  serverTimestamp: number
}

export interface LastCpi {
  grade: number
  totalCxp: number
  seasonCxp: number
  gradeScore: number
  targetGradeScore: number
  soulPower: number
  targetSoulPower: number
  gradeProgress: number
  issuesList: number[]
  issueScore: number
  status: number
  lastEvaluationTime: number
  lastEvaluationVersion: string
  unreadEvaluationsList: any[]
}

export interface CustomEggInfoList {
  identifier: string
  name: string
  value: number
  hatcheryId: string
  hatcheryMaxX: number
  icon: Icon
  iconWidth: number
  iconHeight: number
  buffsList: BuffsList[]
}

export interface Icon {
  name: string
  directory: string
  ext: string
  compressed: boolean
  url: string
  checksum: string
}

export interface BuffsList {
  dimension: number
  value: number
}

export interface ArtifactsDb {
  inventoryItemsList: InventoryItemsList[]
  itemSequence: number
  inventorySlotsList: any[]
  activeArtifactsDeprecatedList: any[]
  activeArtifactSetsList: ActiveArtifactSetsList[]
  savedArtifactSetsList: SavedArtifactSetsList[]
  artifactStatusList: ArtifactStatusList[]
  fuelingMission: FuelingMission
  missionInfosList: MissionInfosList[]
  missionArchiveList: MissionArchiveList[]
  discoveredArtifactsDeprecatedList: any[]
  craftableArtifactsDeprecatedList: any[]
  craftingCountsDeprecatedList: any[]
}

export interface InventoryItemsList {
  itemId: number
  artifact: Artifact
  quantity: number
  serverId: string
}

export interface Artifact {
  spec: Spec2
  stonesList: StonesList2[]
}

export interface Spec2 {
  name: number
  level: number
  rarity: number
  egg: number
}

export interface StonesList2 {
  name: number
  level: number
  rarity: number
  egg: number
}

export interface ActiveArtifactSetsList {
  slotsList: SlotsList[]
}

export interface SlotsList {
  occupied: boolean
  itemId: number
}

export interface SavedArtifactSetsList {
  slotsList: SlotsList2[]
  uid: number
}

export interface SlotsList2 {
  occupied: boolean
  itemId: number
}

export interface ArtifactStatusList {
  spec: Spec3
  discovered: boolean
  craftable: boolean
  recipeDiscovered: boolean
  seen: boolean
  count: number
}

export interface Spec3 {
  name: number
  level: number
}

export interface FuelingMission {
  ship: number
  status: number
  durationType: number
  fuelList: FuelList[]
  level: number
  capacity: number
  targetArtifact: number
}

export interface FuelList {
  egg: number
  amount: number
}

export interface MissionInfosList {
  ship: number
  status: number
  durationType: number
  fuelList: FuelList2[]
  level: number
  durationSeconds: number
  capacity: number
  qualityBump: number
  targetArtifact: number
  secondsRemaining: number
  startTimeDerived: number
  missionLog: string
  identifier: string
}

export interface FuelList2 {
  egg: number
  amount: number
}

export interface MissionArchiveList {
  ship: number
  status: number
  durationType: number
  fuelList: FuelList3[]
  level: number
  durationSeconds: number
  capacity: number
  secondsRemaining: number
  startTimeDerived: number
  missionLog: string
  identifier: string
  qualityBump?: number
  targetArtifact?: number
}

export interface FuelList3 {
  egg: number
  amount: number
}

export interface ShellDb {
  shellInventoryList: ShellInventoryList[]
  shellElementInventoryList: ShellElementInventoryList[]
  shellVariationInventoryList: ShellVariationInventoryList[]
  shellSetInventoryList: ShellSetInventoryList[]
  shellObjectInventoryList: ShellObjectInventoryList[]
  farmConfigsList: FarmConfigsList[]
  savedConfigsList: SavedConfigsList[]
  newShellsDownloadedList: any[]
  newShellsSeenList: string[]
  lastShowcaseFeaturedTimeSeen: number
  lightingControlsUnlocked: boolean
}

export interface ShellInventoryList {
  identifier: string
  owned: boolean
}

export interface ShellElementInventoryList {
  element: number
  setIdentifier: string
}

export interface ShellVariationInventoryList {
  setIdentifier: string
  ownedVariationsList: string[]
}

export interface ShellSetInventoryList {
  identifier: string
  owned: boolean
}

export interface ShellObjectInventoryList {
  identifier: string
  owned: boolean
}

export interface FarmConfigsList {
  lockedElementsList: any[]
  shellConfigsList: ShellConfigsList2[]
  shellSetConfigsList: ShellSetConfigsList2[]
  configureChickensByGroup: boolean
  groupConfigsList: GroupConfigsList2[]
  chickenConfigsList: ChickenConfigsList[]
  lightingConfigEnabled: boolean
  lightingConfig?: LightingConfig
}

export interface ShellConfigsList2 {
  assetType: number
  index: number
  shellIdentifier: string
}

export interface ShellSetConfigsList2 {
  element: number
  index: number
  shellSetIdentifier: string
  variationIdentifier: string
  decoratorIdentifier: string
}

export interface GroupConfigsList2 {
  assetType: number
  groupIdentifier: string
}

export interface ChickenConfigsList {
  chickenIdentifier: string
  hatIdentifier: string
}

export interface LightingConfig {
  lightDir: LightDir
  lightDirectColor: LightDirectColor
  lightDirectIntensity: number
  lightAmbientColor: LightAmbientColor
  lightAmbientIntensity: number
  fogColor: FogColor
  fogNear: number
  fogFar: number
  fogDensity: number
}

export interface LightDir {
  x: number
  y: number
  z: number
}

export interface LightDirectColor {
  x: number
  y: number
  z: number
  w: number
}

export interface LightAmbientColor {
  x: number
  y: number
  z: number
  w: number
}

export interface FogColor {
  x: number
  y: number
  z: number
  w: number
}

export interface SavedConfigsList {
  id: string
  config: Config
  clientSaveTime: number
  serverId?: string
  displayName?: string
  purchased?: boolean
}

export interface Config {
  lockedElementsList: any[]
  shellConfigsList: ShellConfigsList3[]
  shellSetConfigsList: ShellSetConfigsList3[]
  configureChickensByGroup: boolean
  groupConfigsList: GroupConfigsList3[]
  chickenConfigsList: ChickenConfigsList2[]
  lightingConfigEnabled: boolean
  lightingConfig: LightingConfig2
}

export interface ShellConfigsList3 {
  assetType: number
  index: number
  shellIdentifier: string
}

export interface ShellSetConfigsList3 {
  element: number
  index: number
  shellSetIdentifier: string
  variationIdentifier: string
  decoratorIdentifier: string
}

export interface GroupConfigsList3 {
  assetType: number
  groupIdentifier: string
}

export interface ChickenConfigsList2 {
  chickenIdentifier: string
  hatIdentifier: string
}

export interface LightingConfig2 {
  lightDir: LightDir2
  lightDirectColor: LightDirectColor2
  lightDirectIntensity: number
  lightAmbientColor: LightAmbientColor2
  lightAmbientIntensity: number
  fogColor: FogColor2
  fogNear: number
  fogFar: number
  fogDensity: number
}

export interface LightDir2 {
  x: number
  y: number
  z: number
}

export interface LightDirectColor2 {
  x: number
  y: number
  z: number
  w: number
}

export interface LightAmbientColor2 {
  x: number
  y: number
  z: number
  w: number
}

export interface FogColor2 {
  x: number
  y: number
  z: number
  w: number
}

export interface MailState {
  readMailIdsList: string[]
  tipsStatesList: TipsStatesList[]
  tipsChecksum: string
}

export interface TipsStatesList {
  id: string
  reads: number
  timeRead: number
}
