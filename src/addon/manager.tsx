import { addons } from 'storybook/manager-api';

addons.setConfig({
    sidebar: {
        // renderLabel: item => ThemeLabelWrapper({ item }),
    },
});

// TODO: Better inject styles; currently inspired by https://stackblitz.com/~/github.com/Sidnioulz/storybook-sidebar-urls
// Bit hacky at the moment, but we need CSS in the managerHead without making the
// user do it themselves
// Still figuring out if this is best way to do it or I just missed something obvious
const style = document.createElement('style');
style.textContent = `
    :root {
        color-scheme: light dark;
    }
    
    @media (min-width: 600px) {
        .tw-autodocs-label {
            /* Take up the whole button's click area. */
            position: absolute;
            inset: 0;
            width: 100%;
            display: flex;
            gap: 6px;
            -webkit-box-align: start;
            align-items: start;
            padding-left: 22px;
            padding-top: 5px;
            padding-bottom: 4px;
        
        
            /* Copied from SB. Colour. */
            background-color: light-dark(#f6f9fc, #222425);
            border-radius: 4px;
            
            /* Copied from SB. Typography. */
            font-size: 14px;
            text-decoration: none;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            
            /* Copied from SB. Interaction. */
            cursor: pointer;
            color: inherit;
        }
    
        .tw-autodocs-label:hover {
            background-color: light-dark(#e5f2fc, #202c34);
        }
    
        .tw-autodocs-label-icon {
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            margin-top: 2px;
        }
        
        .tw-autodocs-label-icon svg {
            height: 14px;
            width: 14px;
            color: light-dark(#67a300, #c3ff5a);
        }
      
        /* Selected state styling */
        [data-selected="true"] .tw-autodocs-label {
            background-color: #029cfd;
            color: white;
        }
`;
document.head.appendChild(style);
