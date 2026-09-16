# Home Assistant Integration — Echols Learing Center

## What this does

Fully automatic family screen time enforcement.  
Kids earn coins → duties unlock screen time → one tap → TV turns on → timer runs → TV turns off.  
Briana gets push notifications but never has to do anything.

## Setup (10 minutes once Nabu Casa is live)

### 1. Get Nabu Casa ($7/mo)
Go to https://nabucasa.com → sign up → log in to your HA → Settings → Home Assistant Cloud → Sign In.  
Your external URL will be `https://[your-id].ui.nabu.casa`.

### 2. Add helpers
Settings → Devices & Services → Helpers → Add Helper for each item in `helpers.yaml`.  
Or paste the contents of `helpers.yaml` into `configuration.yaml`.

### 3. Add automations
Paste the contents of `automations.yaml` into your HA `automations.yaml` file.  
Reload automations (Developer Tools → YAML → Reload Automations).

### 4. Replace the placeholder entity
Find your TV smart plug entity in HA (Settings → Devices).  
Replace `switch.kids_tv` in automations.yaml with your actual entity ID.

### 5. Find Briana's notification target
After Briana installs the HA Companion App on her iPhone:  
Settings → Companion App → her device name will appear as `notify.mobile_app_[device_name]`.  
Replace `notify.mobile_app_brianas_iphone` in automations.yaml.

### 6. Add Netlify env var
In Netlify → Site Settings → Environment Variables, add:
```
HA_WEBHOOK_BASE_URL = https://[your-id].ui.nabu.casa
```

That's it. The Learing Center will automatically call HA on every:
- Coins earned (after a round completes)
- Duties marked complete
- Screen time requested
- Parent payout

## Screen time rules built in

| Rule | Default | How to change |
|---|---|---|
| Allowed weekdays | 4–7pm | Edit automations.yaml line ~80 |
| Allowed Saturday | 10am–7pm | Edit automations.yaml line ~83 |
| Sunday | Blocked all morning, open 2pm+ | Edit `elc_sunday_sacred_*` automations |
| Dinner block | 6–7pm, TV shuts off | Edit `elc_dinner_block_*` times |
| Daily cap | 45 min | Change `daily_screen_time_cap` helper value |
| Coin rate | 10 coins = 1 min | Change `COINS_PER_SCREEN_MINUTE` in lib/rewards.ts |

## Webhook IDs

These are the webhook triggers configured in automations.yaml:

| Event | Webhook ID |
|---|---|
| Coins earned | `elc_coins_earned` |
| Duties complete | `elc_duties_complete` |
| Screen time request | `elc_screentime_request` |
| Payout | `elc_payout` |

## Smart plug notes

The plug entity `switch.kids_tv` controls the TV power completely.  
When screen time ends, the plug cuts power — no negotiating, no "5 more minutes."  
For the main family TV, you may want a separate plug just for the kids' HDMI input device  
(Apple TV, Roku, game console) rather than cutting the whole TV.
