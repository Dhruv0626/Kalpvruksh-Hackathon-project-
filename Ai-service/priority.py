def calculate_priority(repeat_count, category):

    if category == "Administrative":
        if repeat_count >= 6:
            return "Medium"
        return "Low"

    if repeat_count >= 5:
        return "High"

    elif repeat_count >= 3:
        return "Medium"

    return "Low"