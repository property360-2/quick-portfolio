import os

file_path = r'c:\Users\Administrator\Desktop\quick-portfolio\rate\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the step structure we want to wrap sections with
step_wrappers = [
    # Step 1: Pages
    (r'<!-- B\) PAGES \(One-Time\) -->\s*<div>', 
     r'<div class="form-step" data-step="1">\n                                <!-- B) PAGES (One-Time) -->\n                                <div>'),
    (r'</div>\s*<!-- C\) CORE FEATURES \(One-Time\) -->',
     r'</div>\n                                </div>\n\n                                <!-- C) CORE FEATURES (One-Time) -->'),
    
    # Step 2: Core Features
    (r'<!-- C\) CORE FEATURES \(One-Time\) -->\s*<div>',
     r'<div class="form-step hidden" data-step="2">\n                                <!-- C) CORE FEATURES (One-Time) -->\n                                <div>'),
    (r'</div>\s*<!-- D\) BUSINESS INTELLIGENCE \(One-Time\) -->',
     r'</div>\n                                </div>\n\n                                <!-- D) BUSINESS INTELLIGENCE (One-Time) -->'),

    # Step 3: BI
    (r'<!-- D\) BUSINESS INTELLIGENCE \(One-Time\) -->\s*<div>',
     r'<div class="form-step hidden" data-step="3">\n                                <!-- D) BUSINESS INTELLIGENCE (One-Time) -->\n                                <div>'),
    (r'</div>\s*<!-- E\) INTEGRATIONS & F\) ADVANCED \(One-Time\) -->',
     r'</div>\n                                </div>\n\n                                <!-- E) INTEGRATIONS & F) ADVANCED (One-Time) -->'),

    # Step 4: Int & Adv
    (r'<!-- E\) INTEGRATIONS & F\) ADVANCED \(One-Time\) -->\s*<div>',
     r'<div class="form-step hidden" data-step="4">\n                                <!-- E) INTEGRATIONS & F) ADVANCED (One-Time) -->\n                                <div>'),
    (r'</div>\s*<!-- SETUP \(One-Time\) -->',
     r'</div>\n                                </div>\n\n                                <!-- SETUP (One-Time) -->'),

    # Step 5: Setup
    (r'<!-- SETUP \(One-Time\) -->\s*<div>',
     r'<div class="form-step hidden" data-step="5">\n                                <!-- SETUP (One-Time) -->\n                                <div>'),
]

import re

new_content = content
for pattern, replacement in step_wrappers:
    new_content = re.sub(pattern, replacement, new_content, count=1)

# Add Step 6 for Monthly Subscriptions
# Move the monthly subscriptions block into the left column as Step 6.
monthly_start = r'<!-- MONTHLY RECURRING SERVICES -->'
monthly_end = r'<!-- ESTIMATE SUMMARY -->'

start_idx = new_content.find(monthly_start)
end_idx = new_content.find(monthly_end)

if start_idx != -1 and end_idx != -1:
    monthly_html = new_content[start_idx:end_idx]
    
    # Remove it from right side
    new_content = new_content[:start_idx] + new_content[end_idx:]
    
    # Wrap and inject it after Step 5
    step_5_end = r'</div>\n                                </div>\n\n                            </div>\n\n                            <!-- Right Column:'
    
    step_6_html = f'''</div>
                                </div>

                                <!-- STEP 6: MONTHLY RECURRING -->
                                <div class="form-step hidden" data-step="6">
                                    {monthly_html}
                                </div>

                                <!-- Step Navigation -->
                                <div class="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
                                    <button type="button" id="prev-step-btn" class="hidden px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center">
                                        <span class="material-icons-outlined mr-2">arrow_back</span> Back
                                    </button>
                                    
                                    <div class="text-sm font-medium text-gray-500" id="step-indicator">
                                        Step 1 of 6
                                    </div>
                                    
                                    <button type="button" id="next-step-btn" class="px-6 py-3 bg-wood-accent text-white font-bold rounded-xl shadow-md hover:bg-wood-700 transition-colors flex items-center ml-auto">
                                        Next <span class="material-icons-outlined ml-2">arrow_forward</span>
                                    </button>
                                </div>

                            </div>

                            <!-- Right Column:'''
    
    new_content = new_content.replace(r'</div>\n                            </div>\n\n                            <!-- Right Column:', step_6_html)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Applied multi-step structural changes")
